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
/**
 * The wardrobe panel inside the pop up modal. This shows all the available outfits and
 * skin colors that the player can style their avatar with.
 * @param param0 
 * @returns the wardrobe panel.
 */
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
    id: 'misa',
    name: 'Default Outfit',
    category: 'outfit',
  };
  const initialSkin: WardrobeItem = {
    id: 'skin1',
    name: 'skin1',
    category: 'skin',
  };
  const initalSprite: WardrobeItem[] = [initalOutfit, initialSkin];
  const [spritePreview, setSpritePreview] = useState<WardrobeItem[]>(initalSprite);

  const closeWardrobe = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);

  /**
   * Switches the sprite preview to one with the newly selected item and the 
   * other currently selected item.
   * @param itemID the id of the item(outfit or skin color) the player selected
   */
  function switchSpriteItems(itemID: string): void {
    if (itemID.startsWith('skin')) {
      const currentOutfit = spritePreview[0];
      const newSpritePreview: WardrobeItem[] = [
        currentOutfit,
        UNLOCKABLE_ITEMS.find(item => item.id === itemID) as WardrobeItem,
      ];
      setSpritePreview(newSpritePreview);
    } else {
      const currentSkin = spritePreview[1];
      const newSpritePreview: WardrobeItem[] = [
        DEFAULT_ITEMS.find(item => item.id === itemID) as WardrobeItem,
        currentSkin,
      ];
      setSpritePreview(newSpritePreview);
    }
  }

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
                  src={`${spritePreview[0].name}-${spritePreview[1].name}-front.png`}
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
                          switchSpriteItems('misa');
                        }}
                      />
                      Misa Original
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Birthday Suit Image*/}
                        alt='Birthday Suit'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                      Birthday Suit
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Keqing image*/}
                        alt='Keqing'
                        onClick={() => {
                          switchSpriteItems('keqing');
                        }}
                      />
                      Keqing
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Ness image*/}
                        alt='Ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                      Ness
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Catboy image*/}
                        alt='Catboy'
                        onClick={() => {
                          switchSpriteItems('xiaofei');
                        }}
                      />
                      Catboy
                    </Button>
                  </Stack>
                </div>
                <div className='selectSkinColorMenu'>
                  <Stack spacing={5} direction='row' align='center'>
                    <Button size='md'>
                      <Image
                        src={/*Skin Color 0 image*/}
                        alt='0 skin color'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                      Skin Color 0
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Skin Color 1 image*/}
                        alt='1 skin color'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                      Skin Color 1
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Skin Color 2 image*/}
                        alt='2 skin color'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                      Skin Color 2
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Skin Color 3 image*/}
                        alt='3 skin color'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                      Skin Color 3
                    </Button>
                    <Button size='md'>
                      <Image
                        src={/*Skin Color 4 image*/}
                        alt='4 skin color'
                        onClick={() => {
                          switchSpriteItems('skin4');
                        }}
                      />
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
