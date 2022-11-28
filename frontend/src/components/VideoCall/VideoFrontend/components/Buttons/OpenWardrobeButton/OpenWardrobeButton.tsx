import React, { useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { useDisclosure } from '@chakra-ui/react';
import useTownController from '../../../../../../hooks/useTownController';
import WardrobePanel from './WardrobePanel';

export default function WardrobeButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const coveyTownController = useTownController();

  const openWardrobe = useCallback(() => {
    onOpen();
    coveyTownController.pause();
  }, [onOpen, coveyTownController]);

  return (
    <>
      <MenuItem data-testid='openMenuButton' onClick={openWardrobe}>
        <Typography variant='body1'>Changing Room</Typography>
      </MenuItem>
      <WardrobePanel
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        coveyTownController={coveyTownController}
      />
    </>
  );
}
