import React from 'react';
import { FixedSizeList as ListView } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualList = ({ renderItem, data, preLength = 0, itemSize }, ref) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <ListView
          ref={ref}
          className="needScroll"
          height={height - preLength}
          itemData={data}
          itemSize={itemSize}
          width={width}
          overscanCount={4}
          itemCount={data.length}
        >
          {renderItem}
        </ListView>
      )}
    </AutoSizer>
  );
};

export default React.forwardRef(VirtualList);
