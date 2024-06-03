import ChangeAddressEvent from "../../product/event/change-address.event";
import CustomerCreatedEvent from "../../product/event/customer-created.event";
import EnviaConsoleLogHandler from "../../product/event/handler/EnviaConsoleLog.handler";
import EnviaConsoleLog1Handler from "../../product/event/handler/EnviaConsoleLog1.handler";
import EnviaConsoleLog2Handler from "../../product/event/handler/EnviaConsoleLog2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    
    let eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register("ChangeAddressEvent", eventHandler);

    expect(      
      eventDispatcher.getEventHandlers["ProductCreatedEvent"],      
    ).toBeDefined();

    expect(      
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"],      
    ).toBeDefined();

    expect(      
      eventDispatcher.getEventHandlers["ChangeAddressEvent"],      
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );

    expect(eventDispatcher.getEventHandlers["ChangeAddressEvent"].length).toBe(
      1
    );

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"][0]
    ).toMatchObject(eventHandler);

  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    
    let eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);    

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);    

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);    

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );

    eventHandler = new EnviaConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);   

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      0
    );

    eventHandler = new EnviaConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);   

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      0
    );

    eventHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register("ChangeAddressEvent", eventHandler);   

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ChangeAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ChangeAddressEvent"].length).toBe(
      0
    );

  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    
    let eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    eventHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register("ChangeAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"]
    ).toBeUndefined();

  });

  it("should notify all event handlers - Product", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all event handlers - Customer", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog1Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const eventHandler2 = new EnviaConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const spyEventHandler = jest.spyOn(eventHandler, "handle");       
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");       

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      city: "Blumenau"      
    });

    // Quando o notify for executado o EnviaConsoleLog1Handler.handle() e EnviaConsoleLog2Handler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify all event handlers - Address", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    eventDispatcher.register("ChangeAddressEvent", eventHandler);
    
    const spyEventHandler = jest.spyOn(eventHandler, "handle");       

    expect(
      eventDispatcher.getEventHandlers["ChangeAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const changeAddressEvent = new ChangeAddressEvent({
      id: "123",
      name: "Armando Neto",
      endereco: "Rua 1, 123"      
    });

    // Quando o notify for executado o EnviaConsoleLogHandler.handle() deve ser chamado
    eventDispatcher.notify(changeAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();    
  });
});
