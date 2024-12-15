import { useForm } from 'react-hook-form';

function AddressForm({ register, errors }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            {...register('address', { required: 'Address is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            {...register('city', { required: 'City is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            {...register('postalCode', { required: 'Postal code is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{9}$/,
                message: 'Phone number must be 10 digits',
              },
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
