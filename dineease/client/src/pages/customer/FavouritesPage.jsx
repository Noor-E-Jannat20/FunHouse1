import { favouriteApi } from '../../api/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { AsyncBoundary } from '../../components/StateViews.jsx';
import { currency, Badge } from '../../components/ui.jsx';
import FoodImage from '../../components/FoodImage.jsx';

/** F06 Favourite Menu Items. */
export default function FavouritesPage() {
  const toast = useToast();
  const { add, setOpen } = useCart();
  const { data, loading, error, reload } = useAsync(() => favouriteApi.list(), []);
  const favs = data?.data || [];

  const remove = async (menuItemId) => {
    try {
      await favouriteApi.remove(menuItemId);
      toast.info('Removed from favourites');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addToCart = (item) => {
    add(item, 1);
    toast.success(`${item.name} added to cart`);
    setOpen(true);
  };

  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h2 style={{ margin: 0 }}>My Favourites</h2>
        </div>
      </div>
      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={favs.length === 0}
        onRetry={reload}
        emptyProps={{ title: 'No favourites yet', hint: 'Tap the heart on any dish in the menu.', emoji: '🤍' }}
      >
        <div className="grid grid-4">
          {favs.map((f) => (
            <div key={f._id} className="card food-card">
              <FoodImage src={f.menuItem.imageUrl} alt={f.menuItem.name} />
              <div className="card-body">
                <div className="row between">
                  <strong className="food-name">{f.menuItem.name}</strong>
                  <button className="icon-btn" onClick={() => remove(f.menuItem._id)} title="Remove from favourites" aria-label={`Remove ${f.menuItem.name}`}>❤️</button>
                </div>
                <span className="text-sm muted">{f.menuItem.category?.name}</span>
                <div className="row between">
                  <span className="price">{currency(f.menuItem.price)}</span>
                  {f.menuItem.isAvailable ? <Badge tone="success">Available</Badge> : <Badge tone="neutral">Sold out</Badge>}
                </div>
                {f.menuItem.isAvailable && (
                  <button className="btn btn-sm btn-block" onClick={() => addToCart(f.menuItem)}>Add to Cart</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AsyncBoundary>
    </>
  );
}
