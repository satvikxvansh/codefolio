import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import exec from 'k6/execution';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js';

// ───────────── CONFIG (all overridable with -e KEY=value) ─────────────
const env = (k, d = '') => (__ENV[k] !== undefined ? __ENV[k] : d);
const BASE_URL = env('BASE_URL', 'http://localhost:3000').replace(/\/$/, '');
const LABEL = env('LABEL', 'run');                 // baseline | after
const PROFILE = env('PROFILE', 'full');            // smoke | cold | full | sync | stress
const OUT_DIR = env('OUT_DIR', 'loadtest/results');

const SIGNIN_PATH = env('SIGNIN_PATH', '/signin');
const HEALTH_PATH = env('HEALTH_PATH', '/');
const EMAIL = env('EMAIL');
const PASSWORD = env('PASSWORD');
const LC_USER = env('LC_USERNAME');
const CF_USER = env('CF_USERNAME');
const COOKIE_NAME = env('COOKIE_NAME');            // auto-detects first cookie if empty
const CACHE_HEADER = env('CACHE_HEADER', 'x-cache').toLowerCase(); // e.g. "X-Cache: HIT"
const LOADTEST_KEY = env('LOADTEST_KEY');          // lets you bypass rate limiter on staging

const LC_PATH = env('LC_DATA_PATH', `/api/leetcode/userData?username=${encodeURIComponent(LC_USER)}`);
const CF_PATH = env('CF_DATA_PATH', `/api/codeforces/userData?username=${encodeURIComponent(CF_USER)}`);
const LC_SYNC_PATH = env('LC_SYNC_PATH', '/api/leetcode/updateData');
const CF_SYNC_PATH = env('CF_SYNC_PATH', '/api/codeforces/updateData');
const COMPARE_PATH = env('COMPARE_PATH');
const HEATMAP_PATH = env('HEATMAP_PATH');
const CONTESTS_PATH = env('CONTESTS_PATH');

const SIGNIN_BODY = env('SIGNIN_BODY_JSON', JSON.stringify({ email: EMAIL, password: PASSWORD }));
const SYNC_BODY_LC = env('SYNC_BODY_LC_JSON', JSON.stringify({ username: LC_USER }));
const SYNC_BODY_CF = env('SYNC_BODY_CF_JSON', JSON.stringify({ username: CF_USER }));

const VUS = Number(env('VUS', '25'));
const DUR_S = Number(env('DURATION_S', '60'));
const THINK = Number(env('THINK', '0.2'));
const SYNC_ROUNDS = Number(env('SYNC_ROUNDS', '3'));
const SYNC_PAUSE_S = Number(env('SYNC_PAUSE_S', '10'));
const STRESS_LEVELS = env('STRESS_LEVELS', '5,10,25,50,100').split(',').map(Number);
const RAMP_S = 5;
const HOLD_S = Number(env('STRESS_HOLD_S', '30'));

// ───────────── METRICS ─────────────
const LAT_NAMES = ['signin', 'me', 'userData_lc', 'userData_cf', 'compare', 'heatmap', 'contests',
  'sync_lc', 'sync_lc_repeat', 'sync_cf', 'sync_cf_repeat', 'cold_first', 'cold_second'];
const SIZE_NAMES = ['me', 'userData_lc', 'userData_cf', 'compare', 'heatmap', 'contests', 'sync_lc', 'sync_cf'];

const T = {}; LAT_NAMES.forEach((n) => (T[n] = new Trend(`lat_${n}`, true)));
const S = {}; SIZE_NAMES.forEach((n) => (S[n] = new Trend(`size_${n}`)));
const errors = new Rate('errors');            // non-2xx (429 excluded, counted separately)
const gzipRate = new Rate('gzip');            // share of OK responses that were compressed
const cacheHit = new Rate('cache_hit');       // only if backend sends CACHE_HEADER
const rateLimited = new Counter('rate_limited');
const readReqs = new Counter('read_reqs');

const stressLat = {}; const stressErr = {};
STRESS_LEVELS.forEach((l) => {
  stressLat[l] = new Trend(`stress_lat_${l}`, true);
  stressErr[l] = new Rate(`stress_err_${l}`);
});

// ───────────── SCENARIOS ─────────────
const SCEN = {
  smoke: { smoke: { executor: 'per-vu-iterations', vus: 1, iterations: 1, exec: 'readFlow' } },
  cold: { cold: { executor: 'per-vu-iterations', vus: 1, iterations: 1, exec: 'coldFlow', maxDuration: '3m' } },
  full: {
    auth: { executor: 'constant-vus', vus: 3, duration: '20s', exec: 'authFlow' },
    reads: { executor: 'constant-vus', vus: VUS, duration: `${DUR_S}s`, exec: 'readFlow', startTime: '25s' },
  },
  sync: { sync: { executor: 'per-vu-iterations', vus: 1, iterations: 1, exec: 'syncFlow', maxDuration: '10m' } },
  stress: {
    stress: {
      executor: 'ramping-vus', startVUs: 1, exec: 'stressFlow', gracefulRampDown: '5s',
      stages: STRESS_LEVELS.flatMap((l) => [
        { duration: `${RAMP_S}s`, target: l }, { duration: `${HOLD_S}s`, target: l }]),
    },
  },
};

export const options = {
  scenarios: SCEN[PROFILE],
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
  thresholds: { errors: ['rate<0.05'] },
};

// ───────────── HELPERS ─────────────
function header(res, name) {
  for (const k in res.headers) if (k.toLowerCase() === name) return res.headers[k];
  return '';
}

function call(name, method, path, body, auth) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, auth || {});
  if (LOADTEST_KEY) headers['x-loadtest-key'] = LOADTEST_KEY;
  const params = { headers, tags: { endpoint: name }, timeout: '90s' };
  const url = BASE_URL + path;
  const res = method === 'POST' ? http.post(url, body, params) : http.get(url, params);

  const ok = res.status >= 200 && res.status < 300;
  if (res.status === 429) rateLimited.add(1);
  else errors.add(!ok);

  if (ok) {
    if (T[name]) T[name].add(res.timings.duration);
    if (S[name]) {
      const b = res.body;
      S[name].add(!b ? 0 : typeof b === 'string' ? b.length : b.byteLength);
    }
    gzipRate.add(/gzip|br|deflate/i.test(header(res, 'content-encoding')));
    const c = header(res, CACHE_HEADER);
    if (c) cacheHit.add(/hit/i.test(c));
  }
  check(res, { [`${name} 2xx`]: () => ok });
  return res;
}

const READ_SET = [['me', '/me']];
if (LC_USER) READ_SET.push(['userData_lc', LC_PATH]);
if (CF_USER) READ_SET.push(['userData_cf', CF_PATH]);
if (COMPARE_PATH) READ_SET.push(['compare', COMPARE_PATH]);
if (HEATMAP_PATH) READ_SET.push(['heatmap', HEATMAP_PATH]);
if (CONTESTS_PATH) READ_SET.push(['contests', CONTESTS_PATH]);

// ───────────── SETUP: sign in once, share the session ─────────────
export function setup() {
  if (PROFILE === 'cold') return {};
  const res = http.post(BASE_URL + SIGNIN_PATH, SIGNIN_BODY, { headers: { 'Content-Type': 'application/json' } });
  if (res.status < 200 || res.status >= 300) fail(`Sign-in failed (${res.status}): ${res.body}`);
  const names = Object.keys(res.cookies || {});
  const name = COOKIE_NAME || names[0];
  if (name && res.cookies[name]) return { auth: { Cookie: `${name}=${res.cookies[name][0].value}` } };
  let token = '';
  try { token = res.json('token'); } catch (e) { /* no token in body */ }
  if (token) return { auth: { Authorization: `Bearer ${token}` } };
  fail('Signed in but found no cookie or token. Set COOKIE_NAME or tell me your signin response shape.');
}

// ───────────── FLOWS ─────────────
export function authFlow() {
  call('signin', 'POST', SIGNIN_PATH, SIGNIN_BODY, null);
  sleep(1);
}

export function readFlow(data) {
  for (const [name, path] of READ_SET) {
    call(name, 'GET', path, null, data.auth);
    readReqs.add(1);
  }
  sleep(THINK);
}

export function syncFlow(data) {
  // first call = "fresh" sync, every later call = "repeat" (what a user hitting refresh again sees)
  for (let i = 0; i < SYNC_ROUNDS; i++) {
    if (LC_USER) {
      call(i === 0 ? 'sync_lc' : 'sync_lc_repeat', 'POST', LC_SYNC_PATH, SYNC_BODY_LC, data.auth);
      call('sync_lc_repeat', 'POST', LC_SYNC_PATH, SYNC_BODY_LC, data.auth);
    }
    if (CF_USER) {
      call(i === 0 ? 'sync_cf' : 'sync_cf_repeat', 'POST', CF_SYNC_PATH, SYNC_BODY_CF, data.auth);
      call('sync_cf_repeat', 'POST', CF_SYNC_PATH, SYNC_BODY_CF, data.auth);
    }
    sleep(SYNC_PAUSE_S);
  }
}

export function coldFlow() {
  const r1 = http.get(BASE_URL + HEALTH_PATH, { timeout: '120s' });
  T.cold_first.add(r1.timings.duration);
  sleep(1);
  const r2 = http.get(BASE_URL + HEALTH_PATH, { timeout: '120s' });
  T.cold_second.add(r2.timings.duration);
  check(r1, { 'cold first ok': (r) => r.status === 200 });
}

export function stressFlow(data) {
  const elapsed = Date.now() - exec.scenario.startTime;
  const idx = Math.min(STRESS_LEVELS.length - 1, Math.floor(elapsed / ((RAMP_S + HOLD_S) * 1000)));
  const level = STRESS_LEVELS[idx];
  const [name, path] = READ_SET.length > 1 ? READ_SET[1] : READ_SET[0];
  const res = call(name, 'GET', path, null, data.auth);
  stressLat[level].add(res.timings.duration);
  stressErr[level].add(res.status < 200 || res.status >= 300);
  sleep(THINK);
}

// ───────────── SUMMARY → JSON (feeds compare.js) ─────────────
export function handleSummary(data) {
  const vals = (n) => (data.metrics[n] ? data.metrics[n].values || data.metrics[n] : null);
  const trend = (n) => {
    const v = vals(n);
    if (!v || !v.count) return null;
    return { count: v.count, avg: v.avg, med: v.med, p95: v['p(95)'], p99: v['p(99)'], max: v.max };
  };
  const rate = (n) => {
    const v = vals(n);
    return v && v.passes + v.fails > 0 ? v.rate : null;
  };

  const result = {
    meta: { label: LABEL, profile: PROFILE, base_url: BASE_URL, date: new Date().toISOString(),
      vus: VUS, duration_s: DUR_S, think_s: THINK },
    latency: {}, size: {}, rates: {}, counters: {}, stress: {},
  };
  LAT_NAMES.forEach((n) => { const s = trend(`lat_${n}`); if (s) result.latency[n] = s; });
  SIZE_NAMES.forEach((n) => { const s = trend(`size_${n}`); if (s) result.size[n] = { avg: s.avg, max: s.max }; });
  ['errors', 'gzip', 'cache_hit'].forEach((n) => { const r = rate(n); if (r !== null) result.rates[n] = r; });
  const rl = vals('rate_limited'); if (rl) result.counters.rate_limited = rl.count;
  const rr = vals('read_reqs');
  if (rr && rr.count) { result.counters.read_reqs = rr.count; result.throughput_rps = rr.count / DUR_S; }
  STRESS_LEVELS.forEach((l) => {
    const s = trend(`stress_lat_${l}`);
    if (s) result.stress[`vus_${l}`] = { med: s.med, p95: s.p95, err: rate(`stress_err_${l}`) };
  });

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return {
    [`${OUT_DIR}/${LABEL}__${PROFILE}__${ts}.json`]: JSON.stringify(result, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}