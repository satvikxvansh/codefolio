import React, { useState } from 'react';
// import { useAuth } from '../components/Contexts/AuthContext'
import {
  BarChart3,
  Users,
  GitCompare,
  Search,
  Code2,
  Target,
  User,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import CompareForm from '../components/CompareForm';
import CompareResult from '../components/CompareResult';

const CompareFormPage = () => {
  const [isComparing, setIsComparing] = useState(false);

  return (
    <>
      {isComparing && <CompareResult/>}
      {!isComparing && <CompareForm/>}
    </>
  );
};

export default CompareFormPage;
