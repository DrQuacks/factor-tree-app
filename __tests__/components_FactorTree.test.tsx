import { render, screen, waitFor } from './test-utils';
import { act } from '@testing-library/react';
import FactorTree from '../components/FactorTree';

describe('FactorTree', () => {
  it('renders the factor tree with initial number', async () => {
    await act(async () => {
      render(
        <FactorTree
          initialNumber={24}
          onCorrectMove={() => {}}
          onIncorrectMove={() => {}}
          onFullyFactored={() => {}}
          onValidationFailed={() => {}}
          showSolution={false}
        />
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText('24')).toBeInTheDocument();
    });
  });
}); 