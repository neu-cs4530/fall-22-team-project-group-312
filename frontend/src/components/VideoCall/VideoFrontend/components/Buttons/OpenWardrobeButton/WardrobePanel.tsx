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
  Tab,
  TabList,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
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
  const initalOutfit = coveyTownController.ourPlayer.wardrobe.currentOutfit;
  const initialSkin = coveyTownController.ourPlayer.wardrobe.currentSkin;
  const classes = useStyles(makeStyles);
  console.log(coveyTownController.ourPlayer.wardrobe);

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
    if (
      itemID.startsWith('skin') &&
      coveyTownController.ourPlayer.wardrobe.inventory instanceof Map
    ) {
      const currentOutfit = spritePreview[0];
      const newSpritePreview: WardrobeItem[] = [
        currentOutfit,
        coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
      ];
      console.log(newSpritePreview);
      setSpritePreview(newSpritePreview);
    } else {
      const currentSkin = spritePreview[1];
      const newSpritePreview: WardrobeItem[] = [
        coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
        currentSkin,
      ];
      setSpritePreview(newSpritePreview);
    }
  }

  function isOutfitLocked(itemID: string): boolean {
    return (
      coveyTownController.ourPlayer.wardrobe.inventory.find(o => o.id === itemID) === undefined
    );
  }
  console.log(isOutfitLocked('bday'));

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
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={15} align='center'>
              <div className='previewPane'>
                <Image
                  src={`${prefix}${spritePreview[0].id}-${spritePreview[1].id}/${spritePreview[0].id}-${spritePreview[1].id}-front.png`}
                  alt='sprite'
                  className={classes.preview}
                />
              </div>
              <div className='selectClothingPane'>
                <Tabs aria-label='selectClothingMenu'>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='misa'
                        onClick={() => {
                          switchSpriteItems('misa');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('bday')}>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='bday'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('ness')}>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('xiaofei')}>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='xiaofei'
                        onClick={() => {
                          switchSpriteItems('xiaofei');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('keqing')}>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='keqing'
                        onClick={() => {
                          switchSpriteItems('keqing');
                        }}
                      />
                    </Tab>
                  </TabList>
                </Tabs>
              </div>
              <div className='selectSkinColorMenu'>
                <Tabs>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin0/misa-skin0-front.png`}
                        alt='0 skin color'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin1/misa-skin1-front.png`}
                        alt='1 skin color'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin2/misa-skin2-front.png`}
                        alt='2 skin color'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin3/misa-skin3-front.png`}
                        alt='3 skin color'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/misa-skin4/misa-skin4-front.png`}
                        alt='4 skin color'
                        onClick={() => {
                          switchSpriteItems('skin4');
                        }}
                      />
                    </Tab>
                  </TabList>
                </Tabs>
              </div>
              <div>
                <Button title='Confirm' onClick={closeWardrobe}>
                  Confirm
                </Button>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
