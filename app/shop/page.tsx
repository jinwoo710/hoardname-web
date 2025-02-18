import { ShopItem } from '@/types/boardgame';

import { fetchShopItems } from '../actions/shop';
import ShopList from './ShopList';

export const runtime = 'edge';

const LIMIT = 20;

export default async function Shop() {
  const { items } = await fetchShopItems({
    page: 1,
    limit: LIMIT,
    search: '',
  });
  const initialShopItems = items as ShopItem[];
  return <ShopList initialShopItems={initialShopItems} limit={LIMIT} />;
}
