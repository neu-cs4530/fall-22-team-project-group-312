import {
  Button,
  IconButton,
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
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import useTownController from '../../../../../../hooks/useTownController';
import { WardrobeItem } from '../../../../../../types/CoveyTownSocket';

const useStyles = makeStyles({
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
  const classes = useStyles();
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
  async function switchSpriteItems(itemID: string): Promise<void> {
    console.log('hi');
    if (itemID.startsWith('skin')) {
      const currentOutfit = spritePreview[0];
      const newSpritePreview: WardrobeItem[] = [
        currentOutfit,
        town.ourPlayer.wardrobe.inventory
          .get('skin')
          ?.find((item: WardrobeItem) => item.id === itemID) as WardrobeItem,
      ];
      setSpritePreview(newSpritePreview);
    } else {
      const currentSkin = spritePreview[1];
      const newSpritePreview: WardrobeItem[] = [
        town.ourPlayer.wardrobe.inventory
          .get('skin')
          ?.find((item: WardrobeItem) => item.id === itemID) as WardrobeItem,
        currentSkin,
      ];
      setSpritePreview(newSpritePreview);
    }
  }

  function isOutfitUnlocked(itemID: string): boolean {
    console.log('wadrobe: ', town.ourPlayer.wardrobe);
    console.log('inventory: ', town.ourPlayer.wardrobe.inventory);
    return (
      town.ourPlayer.wardrobe.inventory.get('outfit')?.find(o => o.name === itemID) !== undefined
    );
  }

  const prefix = 'assets/atlas/';
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
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={15} align='stretch'>
              <div className='previewPane'>
                <Image
                  src={`${prefix}${spritePreview[0].id}-${spritePreview[1].id}/${spritePreview[0].id}-${spritePreview[1].id}-front.png`}
                  alt='sprite'
                  className={classes.preview}
                />
              </div>
              <div className='selectClothingMenu'>
                <Stack spacing={5} direction='row' align='center'>
                  <IconButton
                    aria-label='Misa Original'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='misa'
                        onClick={() => {
                          switchSpriteItems('misa');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='Birthday Suit'
                    size='lg'
                    //disabled={isOutfitUnlocked('bday')}
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='misa'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='Ness'
                    size='lg'
                    //disabled={isOutfitUnlocked('ness')}
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='Xiaofei'
                    size='lg'
                    //disabled={isOutfitUnlocked('xiaofei')}
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='xiaofei'
                        onClick={() => {
                          switchSpriteItems('xiaofei');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='Keqing'
                    size='lg'
                    //disabled={isOutfitUnlocked('keqing')}
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='keqing'
                        onClick={() => {
                          switchSpriteItems('keqing');
                        }}
                      />
                    }
                  />
                </Stack>
              </div>
              <div className='selectSkinColorMenu'>
                <Stack spacing={5} direction='row' align='center'>
                  <IconButton
                    aria-label='skin color 0'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin0/misa-skin0-front.png`}
                        alt='0 skin color'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='skin color 1'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin1/misa-skin1-front.png`}
                        alt='1 skin color'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='skin color 2'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin2/misa-skin2-front.png`}
                        alt='2 skin color'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='skin color 3'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin3/misa-skin3-front.png`}
                        alt='3 skin color'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                    }
                  />
                  <IconButton
                    aria-label='skin color 4'
                    size='lg'
                    icon={
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='4 skin color'
                        onClick={() => {
                          switchSpriteItems('skin4');
                        }}
                      />
                    }
                  />
                </Stack>
              </div>
              <div>
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
