import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import { ItemCategory, WardrobeItem } from '../../../../../../types/CoveyTownSocket';

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
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={8} align='stretch'>
              <div className='previewPane'>
                <Image src={/*Sprite png will change based on selected items*/} alt='sprite' />
              </div>
              <div className='selectionPane'>
                <div className='selectClothingMenu'>
                  {/* put this in a for loop: <SelectableItem /> */}
                </div>
                <div className='selectSkinColorMenu'>
                  {/* put this in a for loop: <SelectableItem /> */}
                </div>
                <Button title='Confirm'></Button>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
