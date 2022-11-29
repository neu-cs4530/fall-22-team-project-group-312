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
import { WardrobeItem /* WardrobeModel */ } from '../../../../../../types/CoveyTownSocket';

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
function GachaPanel({
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

  const singlePullCost = 0;

  const prefix = 'assets/gacha_anims/';
  const suffix = '.gif';
  const floatingBoxGif = prefix + 'gift_bounce' + suffix;
  const burstBoxGif = prefix + 'gift_burst' + suffix;
  coveyTownController.ourPlayer.wardrobe.currency = 100;
  const playerHasEnoughCoins = coveyTownController.ourPlayer.wardrobe.currency >= singlePullCost;

  const [image, setImage] = useState<string>(prefix + floatingBoxGif + suffix);
  const [bounceVisible, setBounceVisible] = useState<boolean>(true);
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const [pulledItem, setPulledItem] = useState<WardrobeItem>(undefined);
  // useEffect(() => {
  //   console.log(
  //     'Sprite preview has changed to ' + spritePreview[0].id + ' and ' + spritePreview[1].id,
  //   );
  // });
  const closeGacha = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);
  /**
   * Switches the sprite preview to one with the newly selected item and the
   * other currently selected item.
   * @param itemID the id of the item(outfit or skin color) the player selected
   */
  async function getSkin(): Promise<void> {
    const retrievedItem: WardrobeItem = await coveyTownController.gachaPicker.pull(
      coveyTownController.ourPlayer,
    );
    setImage(prefix + retrievedItem.id + suffix);
  }

  const onPullClick = async () => {
    setImage(prefix + burstBoxGif + suffix);
    await getSkin();
  };

  const onConfirmClick = () => {
    setImage(prefix + burstBoxGif + suffix);
  };

  /**
   * modal
   * Gift box animation
   * 'pull' button -> on click, play explode animation, then swap out with obtained item
   * have a toast that says 'item has been added to your inventory'
   * display currency
   * exit button
   */
  return (
    <>
      <Modal isOpen={isOpen} onClose={closeGacha}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pull for outfits</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={15} align='center'>
              <div className='coinDisplay'>{`You have ${coveyTownController.ourPlayer.wardrobe.currency} CoveyCoins.`}</div>
              <div className='previewPane'>
                <Image
                  src={`${floatingBoxGif}`}
                  alt='sprite'
                  className={classes.preview}
                  visibility={bounceVisible ? 'visible' : 'hidden'}
                />
              </div>
              <div className='previewPane'>
                <p>You got...</p>
                <Image
                  src={`${prefix + pulledItem + suffix}`}
                  alt='sprite'
                  className={classes.preview}
                />
                <p>${pulledItem !== undefined ? pulledItem.name : ''}!</p>
              </div>
              <div>
                <Button
                  title={`Click to roll for new items.`}
                  disabled={!playerHasEnoughCoins}
                  onClick={async () => {
                    onPullClick();
                    // const newWardrobe: WardrobeModel = {
                    //   currentOutfit: spritePreview[0],
                    //   currentSkin: spritePreview[1],
                    //   inventory: coveyTownController.ourPlayer.wardrobe.inventory,
                    //   currency: coveyTownController.ourPlayer.wardrobe.currency,
                    // };
                    // coveyTownController.emitWardobeChange(newWardrobe);
                  }}>
                  {`Roll! (-${singlePullCost} CoveyCoins)`}
                </Button>
              </div>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GachaPanel;
