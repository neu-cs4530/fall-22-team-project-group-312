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
  VStack,
} from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import TownController from '../../../../../../classes/TownController';
import { PullResult, WardrobeItem, WardrobeModel } from '../../../../../../types/CoveyTownSocket';

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

  const [singlePullCost, setSinglePullCost] = useState<number>(
    coveyTownController.gachaRoller.pullCost,
  );

  const animPrefix = 'assets/gacha_anims/';
  const animSuffix = '.gif';

  const outfitPrefix = 'assets/preview/';
  const outfitSuffix = '-preview.png';

  const floatingBoxGif = animPrefix + 'gift_bounce' + animSuffix;
  const burstBoxGif = animPrefix + 'gift_burst' + animSuffix;

  const [animImage, setAnimImage] = useState<string>(floatingBoxGif);
  const [resultImage, setResultImage] = useState<string>('');

  const [bounceVisible, setBounceVisible] = useState<boolean>(true);
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const initalOutfit = coveyTownController.ourPlayer.wardrobe.currentOutfit;
  const initialSkin = coveyTownController.ourPlayer.wardrobe.currentSkin;
  const initialCurrency = coveyTownController.ourPlayer.wardrobe.currency;
  const initialInventory = coveyTownController.ourPlayer.wardrobe.inventory;
  const [currentWardrobe, setCurrentWardrobe] = useState<WardrobeModel>({
    currency: initialCurrency,
    currentSkin: initialSkin,
    currentOutfit: initalOutfit,
    inventory: initialInventory,
  });

  const [playerHasEnoughCoins, setPlayerHasEnoughCoins] = useState<boolean>(
    currentWardrobe.currency >= singlePullCost,
  );
  const [currencyDisplay, setCurrencyDisplay] = useState<number>(currentWardrobe.currency);

  const [pulledItem, setPulledItem] = useState<WardrobeItem | undefined>(undefined);

  const closeGacha = useCallback(() => {
    onClose();
    coveyTownController.unPause();
  }, [onClose, coveyTownController]);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const animationDelay = 5000;

  /**
   * Switches the sprite preview to one with the newly selected item and the
   * other currently selected item.
   * @param itemID the id of the item(outfit or skin color) the player selected
   */
  async function doPull(): Promise<void> {
    const { item, wardrobe }: PullResult = coveyTownController.gachaRoller.pull(
      coveyTownController.ourPlayer,
    );
    setCurrencyDisplay(wardrobe.currency);
    setPlayerHasEnoughCoins(currencyDisplay >= singlePullCost);
    setCurrentWardrobe(wardrobe);
    setResultImage(outfitPrefix + item.id + outfitSuffix);
    setPulledItem(item);
    setResultVisible(true);

    coveyTownController.emitWardobeChange({
      currentOutfit: wardrobe.currentOutfit,
      currentSkin: wardrobe.currentSkin,
      inventory: wardrobe.inventory,
      currency: wardrobe.currency,
    });
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeGacha}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gachapon</ModalHeader>
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
                    setResultVisible(false);
                    setPlayerHasEnoughCoins(false);
                    await delay(animationDelay);
                    await doPull();
                    setPlayerHasEnoughCoins(
                      coveyTownController.ourPlayer.wardrobe.currency >= singlePullCost,
                    );
                    setAnimImage(floatingBoxGif);
                    await delay(animationDelay);
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
