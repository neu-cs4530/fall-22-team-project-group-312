import { ChakraProvider, UseDisclosureReturn } from '@chakra-ui/react';
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import React from 'react';
import PlayerController from '../../../../../../classes/PlayerController';
import TownController from '../../../../../../classes/TownController';
import TownControllerContext from '../../../../../../contexts/TownControllerContext';
import { mockTownController } from '../../../../../../TestUtils';
import {
  PlayerLocation,
  WardrobeItem,
  WardrobeModel,
} from '../../../../../../types/CoveyTownSocket';
import WardrobeButton from './OpenWardrobeButton';

const mockToast = jest.fn();
const mockUseDisclosure = mock<UseDisclosureReturn>();
mockUseDisclosure.isOpen = true;

jest.mock('@chakra-ui/react', () => {
  const ui = jest.requireActual('@chakra-ui/react');
  return {
    ...ui,
    useToast: () => mockToast,
    useDisclosure: () => {
      return mockUseDisclosure;
    },
  };
});
/**
 * Tests wardrobe panel for emitted messages in accordance with manual testing.
 */
describe('Wardrobe Panel', () => {
  let mockedTownController: MockProxy<TownController>;
  let renderData: RenderResult;
  let confirmButton: HTMLElement;
  let skin0Option: HTMLElement;
  let skin3Option: HTMLElement;
  let bdayOption: HTMLElement;

  const inventory: WardrobeItem[] = [
    { id: 'misa', name: 'default outfit', category: 'outfit' },
    { id: 'skin0', name: 'skin0', category: 'skin' },
    { id: 'skin1', name: 'skin1', category: 'skin' },
    { id: 'skin2', name: 'skin2', category: 'skin' },
    { id: 'skin3', name: 'skin3', category: 'skin' },
    { id: 'skin4', name: 'skin4', category: 'skin' },
    { id: 'bday', name: 'Birthday Suit', category: 'outfit' },
  ];
  const playerLocation: PlayerLocation = {
    moving: false,
    x: 0,
    y: 0,
    rotation: 'front',
  };
  const testWardrobe: WardrobeModel = {
    currentOutfit: {
      id: 'misa',
      name: 'default outfit',
      category: 'outfit',
    },
    currentSkin: {
      id: 'skin1',
      name: 'skin1',
      category: 'skin',
    },
    currency: 0,
    inventory: inventory,
  };
  const testWardrobe2: WardrobeModel = {
    currentOutfit: {
      id: 'misa',
      name: 'default outfit',
      category: 'outfit',
    },
    currentSkin: {
      id: 'skin0',
      name: 'skin0',
      category: 'skin',
    },
    currency: 0,
    inventory: inventory,
  };
  const currentPlayer = new PlayerController(nanoid(), nanoid(), playerLocation, testWardrobe);
  const openWardrobePane = async () => {
    mockedTownController = mockTownController({
      ourPlayer: currentPlayer,
    });
    renderData = render(
      <ChakraProvider>
        <TownControllerContext.Provider value={mockedTownController}>
          <WardrobeButton />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );

    confirmButton = renderData.getByTestId('confirmButton');
    skin0Option = renderData.getByTestId('skin0');
    skin3Option = renderData.getByTestId('skin3');
    bdayOption = renderData.getByTestId('bday');
  };

  beforeEach(async () => {
    mockUseDisclosure.onClose.mockReset();
    mockClear(mockToast);
  });
  it('Sprite preview changes after a different skin (skin0) is chosen', async () => {
    await openWardrobePane();
    await fireEvent.click(skin0Option);
    await fireEvent.click(confirmButton);

    await waitFor(() => expect(mockedTownController.emitWardobeChange).toBeCalledTimes(1));
    await waitFor(() =>
      expect(mockedTownController.emitWardobeChange).toBeCalledWith(testWardrobe2),
    );
  });
  it('Sprite preview changes after skin3 option is chosen', async () => {
    await openWardrobePane();
    await fireEvent.click(skin3Option);
    await fireEvent.click(confirmButton);
    testWardrobe2.currentSkin.id = 'skin3';
    testWardrobe2.currentSkin.name = 'skin3';

    await waitFor(() => expect(mockedTownController.emitWardobeChange).toBeCalledTimes(1));
    await waitFor(() =>
      expect(mockedTownController.emitWardobeChange).toBeCalledWith(testWardrobe2),
    );
  });
  it('Sprite preview changes after bday outfit option is chosen', async () => {
    await openWardrobePane();
    await fireEvent.click(bdayOption);
    await fireEvent.click(confirmButton);
    testWardrobe.currentOutfit.id = 'bday';
    testWardrobe.currentOutfit.name = 'Birthday Suit';

    await waitFor(() => expect(mockedTownController.emitWardobeChange).toBeCalledTimes(1));
    await waitFor(() =>
      expect(mockedTownController.emitWardobeChange).toBeCalledWith(testWardrobe),
    );
  });
  it('Displays toast message when confirm button is clicked', async () => {
    await openWardrobePane();
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockToast).toBeCalledWith({
        title: 'Wardrobe changed! Please move the avatar to see the changes.',
        variant: 'solid',
        status: 'success',
        isClosable: true,
      }),
    );
    expect(mockedTownController.emitWardobeChange).toBeCalled();
    await waitFor(() => expect(mockUseDisclosure.onClose).toBeCalled());
  });
});
