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
import {
  DEFAULT_ITEMS,
  UNLOCKABLE_ITEMS,
} from '../../../../../../../../townService/src/lib/WardrobeItem';
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
  const initalOutfit: WardrobeItem = {
    name: 'default outfit',
    category: 'outfit',
    spriteLocation: '',
  };
  const initialSkin: WardrobeItem = {
    name: '1',
    category: 'skin',
    spriteLocation: '',
  };
  const initalSprite: WardrobeItem[] = [initalOutfit, initialSkin];
  const [spritePreview, setSpritePreview] = useState<WardrobeItem[]>(initalSprite);

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
                <Image
                  src={`${spritePreview[0].name}-${spritePreview[1].name}front.png`}
                  alt='sprite'
                />
              </div>
              <div className='selectionPane'>
                <div className='selectClothingMenu'>
                  <Stack spacing={5} direction='row' align='center'>
                    <Button size='md'>
                      <Image
                        src={/*Misa Original Image*/}
                        alt='Misa Original Costume'
                        onClick={() => {
                          const currentSkin = spritePreview[1];
                          const newSpritePreview: WardrobeItem[] = [
                            DEFAULT_ITEMS.find(
                              item => item.name === 'default outfit',
                            ) as WardrobeItem,
                            currentSkin,
                          ];
                          setSpritePreview(newSpritePreview);
                        }}
                      />
                      Misa Original
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Birthday Suit Image*/}
                        alt='Birthday Suit'
                        onClick={() => {
                          const currentSkin = spritePreview[1];
                          const newSpritePreview: WardrobeItem[] = [
                            DEFAULT_ITEMS.find(
                              item => item.name === 'birthday_suit',
                            ) as WardrobeItem,
                            currentSkin,
                          ];
                          setSpritePreview(newSpritePreview);
                        }}
                      />
                      Birthday Suit
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Keqing image*/}
                        alt='Keqing'
                        onClick={() => {
                          setSelectedItem(UNLOCKABLE_ITEMS.find(item => item.name === 'keqing'));
                        }}
                      />
                      Keqing
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Ness image*/}
                        alt='Ness'
                        onClick={() => {
                          setSelectedItem(UNLOCKABLE_ITEMS.find(item => item.name === 'ness'));
                        }}
                      />
                      Ness
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Catboy image*/}
                        alt='Catboy'
                        onClick={() => {
                          setSelectedItem(UNLOCKABLE_ITEMS.find(item => item.name === 'catboy'));
                        }}
                      />
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
                <Button title='Confirm' onClick={closeWardrobe}></Button>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
