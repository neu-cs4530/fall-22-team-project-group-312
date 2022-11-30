import {
  Button,
  Heading,
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import { WardrobeItem, WardrobeModel } from '../../../../../../types/CoveyTownSocket';

const useStyles = makeStyles({
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * The wardrobe panel inside the pop up modal. This shows all the available outfits and
 * skin colors that the player can style their avatar with.
 * @param isOpen sees if the pop up modal is open
 * @param onClose tells the modal what to do when the wardrobe modal is closed
 * @param coveyTownController the townController to manage communications about the wardrobe from
 * frontend to backend
 * @returns the wardrobe panel
 */
function WardrobePanel({
  isOpen,
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
  const toast = useToast();

  const [spritePreview, setSpritePreview] = useState<WardrobeItem[]>([initalOutfit, initialSkin]);
  useEffect(() => {
    console.log(
      'Sprite preview has changed to ' + spritePreview[0].id + ' and ' + spritePreview[1].id,
    );
  });
  const closeWardrobe = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);
  /**
   * Switches the sprite preview to one with the newly selected item and the
   * other currently selected item.
   * @param itemID the id of the item (outfit or skin color) the player selected
   */
  async function switchSpriteItems(itemID: string): Promise<void> {
    if (itemID.startsWith('skin')) {
      const currentOutfit = spritePreview[0];
      const newSpritePreview: WardrobeItem[] = [
        currentOutfit,
        coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
      ];
      await setSpritePreview(newSpritePreview);
    } else {
      const currentSkin = spritePreview[1];
      const newSpritePreview: WardrobeItem[] = [
        coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
        currentSkin,
      ];
      await setSpritePreview(newSpritePreview);
    }
  }
  /**
   * Checks if the outfit is locked, meaning checking if the item is inside the current player's
   * inventory.
   * @param itemID the ID of the outfit that must be checked for inside the player's inventory
   * @returns true if the outfit is not inside the player's inventory and false if it isn't
   */
  function isOutfitLocked(itemID: string): boolean {
    return (
      coveyTownController.ourPlayer.wardrobe.inventory.find(o => o.id === itemID) === undefined
    );
  }

  // add list of outfits so you can write default indexes
  const outfits: string[] = ['misa', 'bday', 'ness', 'xiaohei', 'keqing'];
  const skinColors: string[] = ['skin0', 'skin1', 'skin2', 'skin3', 'skin4'];
  const prefix = 'assets/atlas/';
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
                <Heading as='h5' size='sm'>
                  Select Outfit
                </Heading>
                <Tabs
                  aria-label='selectClothingMenu'
                  defaultIndex={outfits.indexOf(spritePreview[0].id)}>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-misa.png`}
                        alt='misa'
                        data-testid='misa'
                        onClick={() => {
                          switchSpriteItems('misa');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('bday')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-bday.png`}
                        alt='bday'
                        data-testid='bday'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('ness')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-ness.png`}
                        alt='ness'
                        data-testid='ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('xiaohei')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-xiaohei.png`}
                        alt='xiaohei'
                        data-testid='xiaohei'
                        onClick={() => {
                          switchSpriteItems('xiaohei');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('keqing')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-keqing.png`}
                        alt='keqing'
                        data-testid='keqing'
                        onClick={() => {
                          switchSpriteItems('keqing');
                        }}
                      />
                    </Tab>
                  </TabList>
                </Tabs>
              </div>
              <div className='selectSkinColorPane'>
                <Heading as='h5' size='sm'>
                  Select Skin Color
                </Heading>
                <Tabs
                  aria-label='selectSkinColorMenu'
                  defaultIndex={skinColors.indexOf(spritePreview[1].id)}>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-skin0.png`}
                        alt='0 skin color'
                        data-testid='skin0'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-skin1.png`}
                        alt='1 skin color'
                        data-testid='skin1'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin2.png`}
                        alt='2 skin color'
                        data-testid='skin2'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin3.png`}
                        alt='3 skin color'
                        data-testid='skin3'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin4.png`}
                        alt='4 skin color'
                        data-testid='skin4'
                        onClick={() => {
                          switchSpriteItems('skin4');
                        }}
                      />
                    </Tab>
                  </TabList>
                </Tabs>
              </div>
              <div>
                <Button
                  title='Confirm'
                  data-testid='confirmButton'
                  onClick={() => {
                    const newWardrobe: WardrobeModel = {
                      currentOutfit: spritePreview[0],
                      currentSkin: spritePreview[1],
                      inventory: coveyTownController.ourPlayer.wardrobe.inventory,
                      currency: coveyTownController.ourPlayer.wardrobe.currency,
                    };
                    coveyTownController.emitWardobeChange(newWardrobe);
                    closeWardrobe();
                    toast({
                      title: 'Wardrobe changed! Please move the avatar to see the changes.',
                      variant: 'solid',
                      status: 'success',
                      isClosable: true,
                    });
                  }}>
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
