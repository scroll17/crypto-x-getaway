import React, {FC} from 'react';

import { BlockchainNetworkEntity } from '../../../../types/action';

interface NetworkModalContentProps {
  data: BlockchainNetworkEntity
}

export const NetworkModalContent: FC<NetworkModalContentProps> = ({data}) => {
  return (
    <div>NetworkModalContent</div>
  );
};
