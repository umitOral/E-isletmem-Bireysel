import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "isim bilgisi gereklidir"],
      trim: true,
      lowercase: true,
    },
    surname: {
      type: String,
      require: [true, "soyisim bilgisi gereklidir"],
      trim: true,
      lowercase: true,
    },
    activeOrNot: { type: Boolean, default: true },
    email: { type: String, lowercase: true,index:{unique:true}},
    sex: {
      type: String,
      enum: ["male", "female"],
      description: "değer male veya female olmalıdır.",
    },
    birthDate: { type: Date },
    role: { type: String, default: "customer" },
    password: { type: String },
    phone: {
      type: String,
      require:[true, "telefon bilgisi gereklidir"],
      unique:true ,
    },
    userCompany: { type: String, default: "", lowercase: true },
    address: { type: String, lowercase: true },
    billingAddress: { type: String, lowercase: true },
    notes: { type: String,lowercase: true},
    debtStatus: { type: Number, default: 0 },
    images: [
      {
        description: String,
        url: String,
        public_id: String,
        uploadTime: Number,
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    identity: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

userSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true
  next()
})
userSchema.pre('findByIdAndUpdate', function (next) {
  this.options.runValidators = true
  next()
})

const User = mongoose.model("User", userSchema);
export default User;
