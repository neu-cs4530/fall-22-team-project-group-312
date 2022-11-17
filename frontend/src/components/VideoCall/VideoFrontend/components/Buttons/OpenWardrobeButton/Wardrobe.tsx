
/**
 * modal
 * left side of the preview png
 * selection screen on the right
 * navigation menu (own component) 
 * actual items
 * confirm button
 * exit button
 */

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from 'react';
import { ItemCategory, WardrobeItem } from '../../../../../../types/CoveyTownSocket';

export default function Wardrobe(isOpen, onOpen, onClose) {
  const [currentMenuType, setCurrentMenuType] = useState<ItemCategory>();
  const [selectedItem, setSelectedItems] = useState<WardrobeItem[]>();

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeSettings}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Changing Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

