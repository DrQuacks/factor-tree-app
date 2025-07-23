import { render, screen, waitFor } from './test-utils';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FactorNode from '../components/FactorNode';

describe('FactorNode', () => {
  it('renders a static number', async () => {
    await act(async () => {
      render(
        <FactorNode
          nodeId="test-node"
          nodeState="number"
          initialValue={12}
          shouldReset={false}
          handleFactorInput={() => {}}
          onNodeClick={() => {}}
          showFeedback={false}
          feedbackType={null}
          boxHeight={60}
          boxWidth={90}
          onTabNext={() => {}}
          onTabPrevious={() => {}}
          registerInputRef={() => {}}
        />
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('renders an input element', async () => {
    await act(async () => {
      render(
        <FactorNode
          nodeId="input-node"
          nodeState="input"
          initialValue={0}
          shouldReset={false}
          handleFactorInput={() => {}}
          onNodeClick={() => {}}
          showFeedback={false}
          feedbackType={null}
          boxHeight={60}
          boxWidth={90}
          onTabNext={() => {}}
          onTabPrevious={() => {}}
          registerInputRef={() => {}}
        />
      );
    });
    
    // Wait for the input to be rendered
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    
    const input = screen.getByRole('textbox');
    
    // Just verify the input exists and has the expected attributes
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'numeric');
  });
}); 