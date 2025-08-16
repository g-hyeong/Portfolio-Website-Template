// 서버 컴포넌트에서 데이터를 가져와 클라이언트에 전달
import { container } from '@/infrastructure/di/Container';
import { Portfolio } from '@/core/entities/Portfolio';

interface ServerPortfolioProviderProps {
  children: (portfolio: Portfolio) => React.ReactNode;
}

export default async function ServerPortfolioProvider({ children }: ServerPortfolioProviderProps) {
  const portfolioUseCase = container.getPortfolioDataUseCase();
  const portfolio = await portfolioUseCase.execute();

  return <>{children(portfolio)}</>;
}