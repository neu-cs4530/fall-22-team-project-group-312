import { ChakraProvider, UseDisclosureReturn } from '@chakra-ui/react';
import { fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react';
import { keyboard } from '@testing-library/user-event/dist/types/keyboard';
import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { LEFT } from 'phaser';
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
import userEvent from '@testing-library/user-event';

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

describe('Wardrobe Panel', () => {
  let mockedTownController: MockProxy<TownController>;
  let renderData: RenderResult;
  let confirmButton: HTMLElement;
  let misaOption: HTMLElement;
  let skin0Option: HTMLElement;
  let skin1Option: HTMLElement;
  let skin2Option: HTMLElement;
  let skin3Option: HTMLElement;
  let skin4Option: HTMLElement;
  let upArrow: HTMLElement;

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
  // const playerWardrobe = new Wardrobe();
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
  const currentPlayer = new PlayerController(nanoid(), nanoid(), playerLocation, testWardrobe);
  mockedTownController = mockTownController({
    ourPlayer: currentPlayer,
  });
  const openWardrobePane = async (params: { ourPlayer: PlayerController }) => {
    mockedTownController = mockTownController({
      ourPlayer: params.ourPlayer,
    });
    renderData = render(
      <ChakraProvider>
        <TownControllerContext.Provider value={mockedTownController}>
          <WardrobeButton />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );

    await waitFor(() => renderData.getByText('Changing Room'));
    confirmButton = renderData.getByTestId('confirmButton');
    misaOption = renderData.getByTestId('misa');
    skin0Option = renderData.getByTestId('skin0');
    skin1Option = renderData.getByTestId('skin1');
    skin2Option = renderData.getByTestId('skin2');
    skin3Option = renderData.getByTestId('skin3');
    skin4Option = renderData.getByTestId('skin4');
    // upArrow = renderData.getByTestId('upArrow');
  };

  beforeEach(async () => {
    mockUseDisclosure.onClose.mockReset();
    mockClear(mockToast);
  });
  it('Sprite preview changes after a different skin is chosen', async () => {
    const params = {
      ourPlayer: currentPlayer,
    };
    await openWardrobePane(params);
    fireEvent.click(skin0Option);
    fireEvent.click(confirmButton);
    userEvent.keyboard('{ArrowUp/}');
    // fireEvent.keyPress();
    fireEvent.keyDown(renderData, { code: 'ArrowUp', key: 'ArrowUp' });

    await waitFor(() => expect(params.ourPlayer.wardrobe.currentSkin.id).toBe('skin0'));
    await waitFor(() => expect(params.ourPlayer.wardrobe.currentOutfit.id).toBe('misa'));
  });
  it('Sprite preview changes after a different available outfit is chosen', () => {});
  it('Sprite changes in game after player moves and confirm button is clicked', () => {});
  it('Displays toast message when confirm button is clicked', async () => {
    const params = {
      ourPlayer: currentPlayer,
    };
    await openWardrobePane(params);
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockToast).toBeCalledWith({
        title: 'Wardrobe changed! Please move the character to see the changes.',
        variant: 'solid',
        status: 'success',
        isClosable: true,
      }),
    );
    expect(mockedTownController.emitWardobeChange).toBeCalled();
    await waitFor(() => expect(mockUseDisclosure.onClose).toBeCalled());
  }, 1000);
});
// afterEach(cleanup);

// it('Sprite preview changes after a skin/outfit is chosen', () => {
//   const { getByDisplayValue } = render(<WardrobeButton/>);

//   expect(getByDisplayValue().toBe('Initial State');

//   fireEvent.click(getByText('Confirm'));

//   expect(getByText(/Initial/i).textContent).toBe('Initial State Changed');
// });

// it('button click changes props', () => {
//   const { getByText } = render(
//     <App>
//       <TestHook />
//     </App>,
//   );

//   expect(getByText(/Moe/i).textContent).toBe('Moe');

//   fireEvent.click(getByText('Change Name'));

//   expect(getByText(/Steve/i).textContent).toBe('Steve');
// });
