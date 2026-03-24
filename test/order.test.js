import request from 'supertest';
import app from '../server.js'; // Export app từ file server.js của bạn
import mongoose from 'mongoose';

describe('Order Controller Unit Test', () => {
  // Mock dữ liệu đầu vào
  const mockOrderData = {
    userId: "user_123",
    cartItems: [{ productId: "p1", name: "Xe điện", price: 1000, quantity: 1 }],
    subTotal: 1000,
    discount: 0,
    finalPrice: 1000
  };

  test('Nên tạo đơn hàng thành công và trả về mã RE...', async () => {
    const res = await request(app)
      .post('/api/orders/create')
      .send(mockOrderData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toMatch(/^RE\d{6}$/); // Kiểm tra định dạng RE + 6 số
  });

  test('Nên trả về lỗi 500 nếu thiếu dữ liệu bắt buộc', async () => {
    const res = await request(app)
      .post('/api/orders/create')
      .send({ userId: "" }); // Gửi thiếu dữ liệu

    expect(res.statusCode).toEqual(500);
    expect(res.body.success).toBe(false);
  });
});