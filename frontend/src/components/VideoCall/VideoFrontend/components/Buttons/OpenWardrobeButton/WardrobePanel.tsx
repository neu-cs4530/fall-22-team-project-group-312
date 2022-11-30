import {
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
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
import { ItemID, WardrobeItem, WardrobeModel } from '../../../../../../types/CoveyTownSocket';

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
  onClose,
  coveyTownController,
}: {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
  coveyTownController: TownController;
}) {
  const [textInput, setTextInput] = useState<string>('');
  const initalOutfit = coveyTownController.ourPlayer.wardrobe.currentOutfit;
  const initialSkin = coveyTownController.ourPlayer.wardrobe.currentSkin;
  const initialCurrency = coveyTownController.ourPlayer.wardrobe.currency;
  console.log(initialCurrency);
  const initialInventory = coveyTownController.ourPlayer.wardrobe.inventory;
  const classes = useStyles(makeStyles);
  const toast = useToast();

  const [spritePreview, setSpritePreview] = useState<WardrobeModel>({
    currency: initialCurrency,
    currentSkin: initialSkin,
    currentOutfit: initalOutfit,
    inventory: initialInventory,
  });
  useEffect(() => {
    const isSuccessfulyImportedMessage = (isSuccessfulyImported: boolean) => {
      if (isSuccessfulyImported) {
        toast({
          title: 'Successfully Imported! Click on one of the skins to show the update!',
          variant: 'solid',
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to import. Please check that your input string was pasted correctly.',
          variant: 'solid',
          status: 'error',
          isClosable: true,
        });
      }
    };
    coveyTownController.addListener('wardrobeImported', isSuccessfulyImportedMessage);
    return () => {
      coveyTownController.removeListener('wardrobeImported', isSuccessfulyImportedMessage);
    };
  }, [coveyTownController]);

  const closeWardrobe = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);
  /**
   * Switches the sprite preview to one with the newly selected item and the
   * other currently selected item.
   * @param itemID the id of the item(outfit or skin color) the player selected
   */
  async function switchSpriteItems(itemID: ItemID): Promise<void> {
    if (itemID.startsWith('skin')) {
      const newSpritePreview: WardrobeModel = {
        currency: coveyTownController.ourPlayer.wardrobe.currency,
        currentOutfit: spritePreview.currentOutfit,
        currentSkin: coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
        inventory: spritePreview.inventory,
      };
      setSpritePreview(newSpritePreview);
    } else {
      const newSpritePreview: WardrobeModel = {
        currency: coveyTownController.ourPlayer.wardrobe.currency,
        currentOutfit: coveyTownController.ourPlayer.wardrobe.inventory.find(
          (item: WardrobeItem) => item.id === itemID,
        ) as WardrobeItem,
        currentSkin: spritePreview.currentSkin,
        inventory: spritePreview.inventory,
      };
      setSpritePreview(newSpritePreview);
    }
  }

  function isOutfitLocked(itemID: string): boolean {
    return (
      coveyTownController.ourPlayer.wardrobe.inventory.find(o => o.id === itemID) === undefined
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
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={15} align='center'>
              <div className='previewPane'>
                <Image
                  src={`${prefix}${spritePreview.currentOutfit.id}-${spritePreview.currentSkin.id}/${spritePreview.currentOutfit.id}-${spritePreview.currentSkin.id}-front.png`}
                  alt='sprite'
                  className={classes.preview}
                />
              </div>
              <div className='selectClothingPane'>
                <Heading as='h5' size='sm'>
                  Select Outfit
                </Heading>
                <Tabs aria-label='selectClothingMenu'>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-misa.png`}
                        alt='misa'
                        onClick={() => {
                          switchSpriteItems('misa');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('bday')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-bday.png`}
                        alt='bday'
                        onClick={() => {
                          switchSpriteItems('bday');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('ness')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-ness.png`}
                        alt='ness'
                        onClick={() => {
                          switchSpriteItems('ness');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('xiaohei')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-xiaohei.png`}
                        alt='xiaohei'
                        onClick={() => {
                          switchSpriteItems('xiaohei');
                        }}
                      />
                    </Tab>
                    <Tab isDisabled={isOutfitLocked('keqing')}>
                      <Image
                        src={`${prefix}/outfit-previews/preview-keqing.png`}
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
                <Heading as='h5' size='sm'>
                  Select Skin Color
                </Heading>
                <Tabs>
                  <TabList>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-skin0.png`}
                        alt='0 skin color'
                        onClick={() => {
                          switchSpriteItems('skin0');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}/outfit-previews/preview-skin1.png`}
                        alt='1 skin color'
                        onClick={() => {
                          switchSpriteItems('skin1');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin2.png`}
                        alt='2 skin color'
                        onClick={() => {
                          switchSpriteItems('skin2');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin3.png`}
                        alt='3 skin color'
                        onClick={() => {
                          switchSpriteItems('skin3');
                        }}
                      />
                    </Tab>
                    <Tab>
                      <Image
                        src={`${prefix}outfit-previews/preview-skin4.png`}
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
                <Button
                  title='Export'
                  onClick={() => {
                    coveyTownController.emitWardrobeExport();
                  }}>
                  Export
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Button>Import</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Wardrobe Key!</PopoverHeader>
                    <FormControl>
                      <Input value={textInput} onChange={e => setTextInput(e.target.value)}></Input>
                      <FormHelperText>Paste your key here!</FormHelperText>
                      <Button
                        title='Import'
                        onClick={() => {
                          coveyTownController.emitWardrobeImport(textInput);
                        }}>
                        Import
                      </Button>
                    </FormControl>
                  </PopoverContent>
                </Popover>
                <Button
                  title='Confirm'
                  onClick={() => {
                    coveyTownController.emitWardobeChange({
                      currentOutfit: spritePreview.currentOutfit,
                      currentSkin: spritePreview.currentSkin,
                      inventory: coveyTownController.ourPlayer.wardrobe.inventory,
                      currency: coveyTownController.ourPlayer.wardrobe.currency,
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
