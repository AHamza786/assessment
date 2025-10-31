import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`http://localhost:5000/api/items/${id}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Item not found');
        return res.json();
      })
      .then(setItem)
      .catch((e) => {
        if (e.name !== 'AbortError') navigate('/');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #9333ea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Loading item details...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px 20px',
      minHeight: 'calc(100vh - 80px)'
    }}>
      <Link 
        to="/" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#9333ea',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = '#7c3aed'}
        onMouseLeave={(e) => e.target.style.color = '#9333ea'}
      >
        ← Back to Items
      </Link>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '40px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid #f3f4f6'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.3)'
          }}>
            {item.name.charAt(0)}
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '4px'
            }}>
              {item.name}
            </h1>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {item.category}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gap: '24px'
        }}>
          <div style={{
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Item ID
            </div>
            <div style={{
              fontSize: '20px',
              color: '#111827',
              fontWeight: '600'
            }}>
              #{item.id}
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Category
            </div>
            <div style={{
              fontSize: '20px',
              color: '#111827',
              fontWeight: '600'
            }}>
              {item.category}
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#92400e',
              marginBottom: '8px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Price
            </div>
            <div style={{
              fontSize: '36px',
              color: '#78350f',
              fontWeight: '700'
            }}>
              ${item.price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;