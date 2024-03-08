import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    // RETURN THE SUM OF THE PRICE FROM ALL ITEMS IN THE CART
    const initialValue = 0;
    const sumWithInitial = products.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      initialValue,
    );
    return formatValue(sumWithInitial);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const initialValue = 0;
    const countWithInitial = products.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity,
      initialValue,
    );
    return countWithInitial;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
