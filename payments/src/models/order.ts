import mongoose from "mongoose";
import {OrderStatus} from "@qptickets/common";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface OrderAttr {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attr: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    {
        toJSON: {
            transform(dac, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });
//set plugin updateIfCurrentPlugin
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attr: OrderAttr) => {
    return new Order({
        _id: attr.id,
        version: attr.version,
        price: attr.price,
        userId: attr.userId,
        status: attr.status
    })
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export {Order};