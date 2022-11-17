import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ItemCategory, WardrobeItem } from '../../../../../../types/CoveyTownSocket';
import TownController from '../../../../../../classes/TownController';

function WardrobePanel({
  isOpen,
  onOpen,
  onClose,
  coveyTownController,
}: {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
  coveyTownController: TownController;
}) {
  const [currentMenuType, setCurrentMenuType] = useState<ItemCategory>();
  const [selectedItem, setSelectedItems] = useState<WardrobeItem[]>();

  const closeWardrobe = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);

  /**
   * modal
   * left side of the preview png
   * selection screen on the right
   * navigation menu (own component)
   * actual items
   * confirm button
   * exit button
   */
  return (
    <>
      <Modal isOpen={isOpen} onClose={closeWardrobe}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Changing Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className='previewPane'></div>
            <div className='selectionPane'>
              <div className='navigationMenu'>
                <Button title='eyeColor'></Button>
                <Button title='hairStyle'></Button>
                <Button title='skinColor'></Button>
                <Button title='outfit'></Button>
                <Button title='accessory'></Button>
              </div>
              <div className='selectClothingMenu'>
                {/* put this in a for loop: <SelectableItem /> */}
              </div>
              <Button title='Confirm'></Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
