function PaymentForm({ register, errors }) {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
      <div className="grid grid-cols-1 gap-4">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            {...register('cardNumber', { required: "Card number is required" })}
            placeholder="**** **** **** ****"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            aria-describedby="cardNumberError"
          />
          {errors.cardNumber && (
            <p id="cardNumberError" className="mt-1 text-sm text-red-600">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="text"
              {...register('expiryDate', { required: "Expiry date is required" })}
              placeholder="MM/YY"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              aria-describedby="expiryDateError"
            />
            {errors.expiryDate && (
              <p id="expiryDateError" className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          {/* CVV */}
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              {...register('cvv', { required: "CVV is required" })}
              placeholder="***"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              aria-describedby="cvvError"
            />
            {errors.cvv && (
              <p id="cvvError" className="mt-1 text-sm text-red-600">
                {errors.cvv.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
