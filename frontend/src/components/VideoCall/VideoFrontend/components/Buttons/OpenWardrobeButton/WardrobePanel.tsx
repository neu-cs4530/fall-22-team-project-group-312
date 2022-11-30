import {
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
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
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  StackDivider,
  Tab,
  TabList,
  Tabs,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import { ItemID, WardrobeItem, WardrobeModel } from '../../../../../../types/CoveyTownSocket';

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
  const [inputWardrobeKey, setinputWardrobeKey] = useState<string>('');
  const initalOutfit = coveyTownController.ourPlayer.wardrobe.currentOutfit;
  const initialSkin = coveyTownController.ourPlayer.wardrobe.currentSkin;
  const initialCurrency = coveyTownController.ourPlayer.wardrobe.currency;
  const initialInventory = coveyTownController.ourPlayer.wardrobe.inventory;
  const toast = useToast();

  const [spritePreview, setSpritePreview] = useState<WardrobeModel>({
    currency: initialCurrency,
    currentSkin: initialSkin,
    currentOutfit: initalOutfit,
    inventory: initialInventory,
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
  function switchSpriteItems(itemID: ItemID): void {
    if (itemID.startsWith('skin')) {
      // switches the outfit in the sprite preview
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
      // switches the skin in the sprite preview
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

  /**
   * Returns the player's wardrobe as a JSON formatted string.
   * @returns The player's wardrobe as a JSON string.
   */
  function getWardrobeString(): string {
    return JSON.stringify(coveyTownController.ourPlayer.wardrobe);
  }

  /**
   * Download's the player's wardrobe as a text file.
   */
  function exportToFile(): void {
    const element = document.createElement('a');
    const file = new Blob([getWardrobeString()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'WardrobeKey.txt';
    document.body.appendChild(element);
    element.click();
  }

  /**
   * Parses the given input string and saves it to the player's wardrobe and
   * spritePreview. It will return false if given string has invalid inputs like
   * a negative currency or equipped outfit/skins that are not in the inventory.
   * If all fields are valid, it will update the preview and player's wardrobe
   * and return true.
   * @param inputJSON input string being read.
   * @returns true if it is successfully parsed, false otherwise.
   */
  function importWardrobeString(inputJSON: string): boolean {
    let parsedJSON: WardrobeModel;
    try {
      parsedJSON = JSON.parse(inputJSON) as WardrobeModel;
    } catch (e) {
      return false;
    }
    // check if the currency given is non-negative
    if (parsedJSON.currency === undefined || parsedJSON.currency< 0) {
      return false;
    }
    // check if the outfit equiped is in the inventory
    if (
      parsedJSON.currentOutfit === undefined ||
      parsedJSON.inventory.find(item => item.id === parsedJSON.currentOutfit.id) === undefined
    ) {
      return false;
    }
    // check if the skin equiped is in the inventory
    if (
      parsedJSON.currentSkin === undefined ||
      parsedJSON.inventory.find(item => item.id === parsedJSON.currentSkin.id) === undefined
    ) {
      return false;
    }
    if (parsedJSON.inventory === undefined) {
      return false;
    }
    // update wardrobe and sprite preview
    coveyTownController.emitWardobeChange(parsedJSON);
    setSpritePreview(parsedJSON);
    return true;
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

  // list of available outfits and skinColors
  const outfits: string[] = ['misa', 'bday', 'ness', 'xiaohei', 'keqing'];
  const skinColors: string[] = ['skin0', 'skin1', 'skin2', 'skin3', 'skin4'];
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
                />
              </div>
              <div className='selectClothingPane'>
                <Heading as='h5' size='sm'>
                  Select Outfit
                </Heading>
                <Tabs
                  aria-label='selectClothingMenu'
                  defaultIndex={outfits.indexOf(spritePreview.currentOutfit.id)}>
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
                  defaultIndex={skinColors.indexOf(spritePreview.currentSkin.id)}>
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
                    coveyTownController.emitWardobeChange({
                      currentOutfit: spritePreview.currentOutfit,
                      currentSkin: spritePreview.currentSkin,
                      inventory: coveyTownController.ourPlayer.wardrobe.inventory,
                      currency: coveyTownController.ourPlayer.wardrobe.currency,
                    });
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
              <div className='importExportWardrobe'>
                <HStack spacing={15} justify='center'>
                  <Button
                    title='Download Key'
                    size='sm'
                    onClick={() => {
                      exportToFile();
                    }}>
                    Download Key
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <Button size='sm'>Import Key</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Wardrobe Key</PopoverHeader>
                      <FormControl>
                        <Input
                          value={inputWardrobeKey}
                          onChange={e => setinputWardrobeKey(e.target.value)}></Input>
                        <FormHelperText>Paste your key here</FormHelperText>
                      </FormControl>
                      <PopoverFooter>
                        <Button
                          title='Import'
                          onClick={() => {
                            if (importWardrobeString(inputWardrobeKey)) {
                              toast({
                                title:
                                  'Successfully Imported! Click on one of the skins to show the update!',
                                variant: 'solid',
                                status: 'success',
                                isClosable: true,
                              });
                            } else {
                              toast({
                                title:
                                  'Failed to import. Please check that your input string was pasted correctly.',
                                variant: 'solid',
                                status: 'error',
                                isClosable: true,
                              });
                            }
                          }}>
                          Import
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WardrobePanel;
