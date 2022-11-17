import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import Wardrobe from './Wardrobe';

export default function WardrobeButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <MenuItem data-testid='openMenuButton' onClick={openSettings}>
        <Typography variant='body1'>Changing Room</Typography>
      </MenuItem>
      <Wardrobe isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
