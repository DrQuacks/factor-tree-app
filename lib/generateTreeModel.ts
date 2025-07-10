const GAP_PERCENT = 0.1;
const CHILD_RATIO = 0.8;
const ASPECT_RATIO = 3 / 2;

const generateTreeModel = (
    {
        viewHeight,
        viewWidth,
        totalLevels
    }: {
        viewHeight: number;
        viewWidth: number;
        totalLevels: number;
    }
): {
    positions: { x: number, y: number }[][];
    boxHeights: number[];
    boxWidths: number[];
} => {
    console.log('Generating tree model for', totalLevels, 'levels');
    const availableHeight = Math.floor(Math.tanh(totalLevels / 2) * viewHeight);
    const topPadding = Math.floor((viewHeight - availableHeight) / 2);
    console.log('viewHeight:', viewHeight, 'availableHeight:', availableHeight, 'topPadding:', topPadding);

    const rootHeight = availableHeight * (1 - CHILD_RATIO) / (1 - (CHILD_RATIO ** totalLevels));

    let heights: number[] = [];
    for (let i = 0; i < totalLevels; i++) {
        heights = [...heights, (rootHeight * (CHILD_RATIO ** i))];
    }

    const boxHeights = heights.map(h => h * (1 - 2 * GAP_PERCENT));
    const boxWidths = boxHeights.map(h => h * ASPECT_RATIO);

    // Calculate the space the last row of the tree would take up if all leaf slots are filled
    const totalBottomWidth = (boxWidths[totalLevels - 1] * (1 + 2 * GAP_PERCENT)) * (2 ** (totalLevels - 1));

    const positions: { x: number, y: number }[][] = [];

    // Start placing nodes from the bottom row up
    for (let level = totalLevels - 1; level >= 0; level--) {
        const row: { x: number, y: number }[] = [];
        const numNodes = 2 ** level; // Number of nodes at this level

        // Calculate the vertical position for the row
        const rowHeight = heights[level];
        const y = topPadding + heights.slice(0, level).reduce((sum, h) => sum + h, 0) + (rowHeight * GAP_PERCENT);
        console.log(`Level ${level}: rowHeight=${rowHeight}, y=${y}`);

        // Calculate the horizontal starting position for the row
        const rowWidth = (boxWidths[level] * (1 + 2 * GAP_PERCENT)) * numNodes;
        const xStart = (viewWidth - rowWidth) / 2;

        for (let i = 0; i < numNodes; i++) {
            if (level === totalLevels - 1) {
                // Bottom row: evenly space nodes horizontally
                const x = xStart + i * (boxWidths[level] + 2 * boxWidths[level] * GAP_PERCENT) + boxWidths[level] * GAP_PERCENT;
                row.push({ x, y });
            } else {
                // Rows above: position nodes between their children
                if (level + 1 < totalLevels && positions[level + 1]) {
                    const leftChild = positions[level + 1][i * 2];
                    const rightChild = positions[level + 1][i * 2 + 1];
                    if (leftChild && rightChild) {
                        // Center the parent between its children (no horizontal padding for parent nodes)
                        const x = (leftChild.x + rightChild.x) / 2 - boxWidths[level] / 2;
                        console.log(`Level ${level}, node ${i}: leftChild.x=${leftChild.x}, rightChild.x=${rightChild.x}, parent.x=${x}`);
                        row.push({ x, y });
                    } else {
                        // Fallback: center the node
                        const x = viewWidth / 2 - boxWidths[level] / 2;
                        row.push({ x, y });
                    }
                } else {
                    // Fallback: center the node
                    const x = viewWidth / 2 - boxWidths[level] / 2;
                    row.push({ x, y });
                }
            }
        }

        positions.unshift(row); // Add the row to the beginning of the array
    }

    return { positions, boxHeights, boxWidths };
};

export { generateTreeModel };