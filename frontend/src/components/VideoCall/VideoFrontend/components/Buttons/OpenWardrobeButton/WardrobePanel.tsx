import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import { WardrobeItem } from '../../../../../../types/CoveyTownSocket';

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
                  <Stack spacing={5} direction='row' align='center'>
                    <Button size='md'>
                      <Image src={/*Misa Original Image*/} alt='Misa Original Costume' onClick={} />
                      Misa Original
                    </Button>
                    <Button size='md'>
                      <Image src={/*Birthday Suit Image*/} alt='Birthday Suit' onClick={} />
                      Birthday Suit
                    </Button>
                    <Button size='md'>
                      <Image src={/*Keqing image*/} alt='Keqing' onClick={} />
                      Keqing
                    </Button>
                    <Button size='md'>
                      <Image src={/*Ness image*/} alt='Ness' onClick={} />
                      Ness
                    </Button>
                    <Button size='md'>
                      <Image src={/*Catboy image*/} alt='Catboy' onClick={} />
                      Catboy
                    </Button>
                  </Stack>
                </div>
                <div className='selectSkinColorMenu'>
                  <Stack spacing={5} direction='row' align='center'>
                    <Button size='md'>
                      <Image src={/*Skin Color 0 image*/} alt='0 skin color' onClick={} />
                      Skin Color 0
                    </Button>
                    <Button size='md'>
                      <Image src={/*Skin Color 1 image*/} alt='1 skin color' onClick={} />
                      Skin Color 1
                    </Button>
                    <Button size='md'>
                      <Image src={/*Skin Color 2 image*/} alt='2 skin color' onClick={} />
                      Skin Color 2
                    </Button>
                    <Button size='md'>
                      <Image src={/*Skin Color 3 image*/} alt='3 skin color' onClick={} />
                      Skin Color 3
                    </Button>
                    <Button size='md'>
                      <Image src={/*Skin Color 4 image*/} alt='4 skin color' onClick={} />
                      Skin Color 4
                    </Button>
                  </Stack>
                </div>
                <Button title='Confirm' onClick={}></Button>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
