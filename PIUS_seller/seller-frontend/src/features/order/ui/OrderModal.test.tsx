import {
 render,
 screen,
 fireEvent
} from "@testing-library/react";

import {
 describe,
 it,
 expect,
 vi
} from "vitest";

import { OrderModal } from "./OrderModal";

const queryMock = vi.fn();

vi.mock(
 "../../../entities/order/api/orderApi",
 () => ({
   useGetOrderByIdQuery: (...args:any[]) =>
      queryMock(...args),
 })
);

const order = {
 id: 1,
 orderNumber: "1001",
 status: "pending",
 totalAmount: 5000,
 deliveryAddress: "Paris",
 items: [
   {
    productId: 10,
    quantity: 2,
    price: 2500,
   },
 ],
};

describe("OrderModal", () => {

 it("returns null without order", () => {
   queryMock.mockReturnValue({
     data:null,
     isLoading:false,
   });

   const { container } = render(
      <OrderModal
       open
       onClose={vi.fn()}
       order={null}
      />
   );

   expect(container.firstChild).toBeNull();
 });

 it("shows loading", () => {
   queryMock.mockReturnValue({
     data:null,
     isLoading:true,
   });

   render(
    <OrderModal
      open
      onClose={vi.fn()}
      order={order}
    />
   );

   expect(
    screen.getByText("Загрузка...")
   ).toBeInTheDocument();
 });

 it("renders order details", () => {
   queryMock.mockReturnValue({
      data: order,
      isLoading:false,
   });

   render(
    <OrderModal
      open
      onClose={vi.fn()}
      order={order}
    />
   );

   expect(
     screen.getByText(/Заказ №/)
   ).toBeInTheDocument();

   expect(
     screen.getByText(/pending/)
   ).toBeInTheDocument();

   expect(
    screen.getByText(/ID товара: 10/)
   ).toBeInTheDocument();
 });

 it("uses fetched data over prop order", () => {
   queryMock.mockReturnValue({
     isLoading:false,
     data:{
       ...order,
       status:"completed"
     }
   });

   render(
    <OrderModal
      open
      onClose={vi.fn()}
      order={order}
    />
   );

   expect(
    screen.getByText(/completed/)
   ).toBeInTheDocument();
 });

 it("calls onClose", () => {
   queryMock.mockReturnValue({
     data:order,
     isLoading:false,
   });

   const onClose = vi.fn();

   render(
    <OrderModal
      open
      onClose={onClose}
      order={order}
    />
   );

   fireEvent.click(
    screen.getByText("Закрыть")
   );

   expect(onClose).toHaveBeenCalled();
 });
});