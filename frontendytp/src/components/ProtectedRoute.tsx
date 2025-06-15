import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 开发阶段暂时禁用认证检查
  return <>{children}</>;

  // 生产环境使用以下代码：
  // import { Navigate } from 'react-router-dom';
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  // return <>{children}</>;
};

export default ProtectedRoute; 