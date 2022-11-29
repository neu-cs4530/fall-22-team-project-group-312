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
import PlayerController from '../../../../../../classes/PlayerController';
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
  const classes = useStyles(makeStyles);

  const singlePullCost = 10;

  const animPrefix = 'assets/gacha_anims/';
  const animSuffix = '.gif';

  const outfitPrefix = 'assets/preview/';
  const outfitSuffix = '-preview.png';

  const floatingBoxGif = animPrefix + 'gift_bounce' + animSuffix;
  const burstBoxGif = animPrefix + 'gift_burst' + animSuffix;
  coveyTownController.ourPlayer.wardrobe.currency = 100;

  const [animImage, setAnimImage] = useState<string>(floatingBoxGif);
  const [resultImage, setResultImage] = useState<string>('');

  const [bounceVisible, setBounceVisible] = useState<boolean>(true);
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const [currentWardrobe, setCurrentWardrobe] = useState<WardrobeModel>(
    coveyTownController.ourPlayer.wardrobe,
  );
  const [playerHasEnoughCoins, setPlayerHasEnoughCoins] = useState<boolean>(
    currentWardrobe.currency >= singlePullCost,
  );
  const [currencyDisplay, setCurrencyDisplay] = useState<number>(currentWardrobe.currency);

  const [pulledItem, setPulledItem] = useState<WardrobeItem | undefined>(undefined);

  const closeGacha = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);

  useEffect(() => {
    const updatePlayer = (pullingPlayer: PlayerController) => {
      setCurrentWardrobe(pullingPlayer.wardrobe);
      setCurrencyDisplay(pullingPlayer.wardrobe.currency);
      setPlayerHasEnoughCoins(pullingPlayer.wardrobe.currency >= singlePullCost);
    };
    coveyTownController.addListener('playerPulled', updatePlayer);
    coveyTownController.addListener('playerWardrobeChanged', updatePlayer);
  }, [coveyTownController, setCurrentWardrobe, setPlayerHasEnoughCoins]);

  /**
   * Switches the sprite preview to one with the newly selected item and the
   * other currently selected item.
   * @param itemID the id of the item(outfit or skin color) the player selected
   */
  async function doPull(): Promise<void> {
    const retrievedItem: WardrobeItem = await coveyTownController.gachaRoller.pull(
      coveyTownController.ourPlayer,
    );
    setResultImage(outfitPrefix + retrievedItem.id + outfitSuffix);
    setPulledItem(retrievedItem);
    setResultVisible(true);
    console.log('Pulled: ' + retrievedItem.id);
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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
              <div className='coinDisplay'>{`You have ${currencyDisplay} CoveyCoins.`}</div>
              <div className='previewPane'>
                <Image
                  src={`${animImage}`}
                  alt='sprite'
                  className={classes.preview}
                  visibility={bounceVisible ? 'visible' : 'hidden'}
                />
              </div>
              <div className='previewPane' hidden={!resultVisible}>
                You got...
                <Image src={`${resultImage}`} alt='sprite' className={classes.preview} />
                <p>{pulledItem !== undefined ? pulledItem.name : ''}!</p>
              </div>
              <div>
                <Button
                  title={`Click to roll for new items.`}
                  disabled={!playerHasEnoughCoins}
                  onClick={async () => {
                    setAnimImage(burstBoxGif);
                    // await onPullClick();
                    setResultVisible(false);
                    await delay(5000);
                    await doPull();
                    // const newWardrobe: WardrobeModel = {
                    //   currentOutfit: spritePreview[0],
                    //   currentSkin: spritePreview[1],
                    //   inventory: coveyTownController.ourPlayer.wardrobe.inventory,
                    //   currency: coveyTownController.ourPlayer.wardrobe.currency,
                    // };
                    // coveyTownController.emitWardobeChange(newWardrobe);
                    setAnimImage(floatingBoxGif);
                    await delay(5000);
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
