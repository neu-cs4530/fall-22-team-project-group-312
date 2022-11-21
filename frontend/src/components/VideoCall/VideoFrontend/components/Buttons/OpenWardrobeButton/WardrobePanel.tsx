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
import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ITEMS } from '../../../../../../../../townService/src/lib/WardrobeItem';
import TownController from '../../../../../../classes/TownController';
import useTownController from '../../../../../../hooks/useTownController';
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
  const town = useTownController();
  const initalOutfit = town.ourPlayer.wardrobe.currentOutfit;
  const initialSkin = town.ourPlayer.wardrobe.currentSkin;

  const [spritePreview, setSpritePreview] = useState<WardrobeItem[]>([initalOutfit, initialSkin]);
  useEffect(() => {
    console.log('Sprite preview changed.');
  });

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
        DEFAULT_ITEMS.find(item => item.id === itemID) as WardrobeItem,
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

  function unlocked(itemID: string): boolean {
    if (town.ourPlayer.wardrobe.inventory.get('outfit')?.find(o => o.name === itemID)) {
      return true;
    }
    return false;
  }

  const prefix = 'frontend/public/assets/atlas/';
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
                  src={`${prefix}${spritePreview[0].name}-${spritePreview[1].name}/
                  //${spritePreview[0].name}-${spritePreview[1].name}-front.png`}
                  alt='sprite'
                />
              </div>
              <div className='selectionPane'>
                <div className='selectClothingMenu'>
                  <Stack spacing={5} direction='row' align='center'>
                    <Button size='md'>
                      <Image
                        src={'keqing-skin0.png'}
                        alt='Misa Original Costume'
                        onClick={() => {
                          switchSpriteItems('misa');
                        }}
                      />
                      Misa Original
                    </Button>
                    <Button disabled={unlocked('bday')} size='md'>
                      <Image
                        src={'bday-skin1.png'}
                        alt='Birthday Suit'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                      Birthday Suit
                    </Button>
                    <Button disabled={unlocked('keqing')} size='md'>
                      <Image
                        src={'keqing-skin1.png'}
                        alt='Keqing'
                        onClick={() => {
                          switchSpriteItems('keqing');
                        }}
                      />
                      Keqing
                    </Button>
                    <Button disabled={unlocked('ness')} size='md'>
                      <Image
                        src={'ness-skin1.png'}
                        alt='Ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                      Ness
                    </Button>
                    <Button disabled={unlocked('xiaofei')} size='md'>
                      <Image
                        src={'ness-skin1.png'}
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
                        src={'ness-skin1.png'}
                        alt='0 skin color'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                      Skin Color 0
                    </Button>
                    <Button size='md'>
                      <Image
                        src={'ness-skin1.png'}
                        alt='1 skin color'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                      Skin Color 1
                    </Button>
                    <Button size='md'>
                      <Image
                        src={'ness-skin1.png'}
                        alt='2 skin color'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                      Skin Color 2
                    </Button>
                    <Button size='md'>
                      <Image
                        src={'ness-skin1.png'}
                        alt='3 skin color'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                      Skin Color 3
                    </Button>
                    <Button size='md'>
                      <Image
                        src={'ness-skin1.png'}
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
