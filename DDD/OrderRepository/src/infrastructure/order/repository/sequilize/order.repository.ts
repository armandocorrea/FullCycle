import { or } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {  
  async create(entity: Order): Promise<void> {
    
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const customerId = entity.customerId;
    const customerModel = await CustomerModel.findOne({ where: { id: customerId } });

    entity.items.map((item) => {
      OrderItemModel.update(
        {
          quantity: item.quantity,
          price: item.price,
          product_id: item.productId,
          name: item.name        
        },
        { 
          where: { 
            order_id: entity.id 
          }
        }
      )
    });

    await OrderModel.update(
      {
        customer_id: entity.customerId,
        customer: customerModel,
        items: entity.items,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        },      
      }
    )
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: ["items"] });
    
    let orderItems: OrderItem[] = [];

    orderModel.items.map((item) => {
      orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
    });   

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({include: ["items"]});

    let orders: Order[] = [];

    orderModels.map((orderModel) => {        
        let orderItems: OrderItem[] = [];
  
        orderModel.items.map((item) => {
          orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
        }); 
  
        orders.push(new Order(orderModel.id, orderModel.customer_id, orderItems));
    });

    return orders;
  }

}
