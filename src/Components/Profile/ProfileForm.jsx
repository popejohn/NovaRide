import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FaUser, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Input from '../Input';
import Button from '../Button';

const ProfileForm = ({ initialValues, onSubmit, validationSchema }) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
    >
        {({ isSubmitting, setFieldValue, values, errors, touched, handleSubmit }) => (
            <Form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <Field
                        name="firstname"
                        as={Input}
                        label="First Name"
                        placeholder="First name"
                        variant="light"
                        icon={FaUser}
                        error={touched.firstname && errors.firstname}
                    />
                </div>

                <div className="space-y-1">
                    <Field
                        name="lastname"
                        as={Input}
                        label="Last Name"
                        placeholder="Last name"
                        variant="light"
                        icon={FaUser}
                        error={touched.lastname && errors.lastname}
                    />
                </div>

                <div className="space-y-1">
                    <Field
                        name="phone"
                        as={Input}
                        label="Phone Number"
                        placeholder="Phone number"
                        variant="light"
                        icon={FaPhone}
                        error={touched.phone && errors.phone}
                    />
                </div>

                <div className="space-y-2 group/input">
                    <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${touched.dateOfBirth && errors.dateOfBirth ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-600'}`}>
                        Date of Birth
                    </label>
                    <div className="relative">
                        <div className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 pointer-events-none ${touched.dateOfBirth && errors.dateOfBirth ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-500'}`}>
                            <FaCalendarAlt className="text-xl" />
                        </div>
                        <DatePicker
                            selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                            onChange={(date) => {
                                setFieldValue('dateOfBirth', date);
                            }}
                            onBlur={() => { }}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            placeholderText="Select your birth date"
                            autoComplete="off"
                            className={`w-full pl-16 pr-8 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm bg-white/40 backdrop-blur-xl border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-orange-500/30
                ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500/50 bg-red-500/5 text-red-500' : 'hover:border-neutral-300'}
                shadow-sm group-focus-within/input:shadow-2xl group-focus-within/input:shadow-orange-500/5`}
                        />
                        <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none transition-all duration-300 opacity-0 group-focus-within/input:opacity-100 ring-[6px] ring-orange-500/5" />
                    </div>
                    {touched.dateOfBirth && errors.dateOfBirth && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-[10px] font-bold text-red-500 italic flex items-center gap-2 px-1 uppercase tracking-wider"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {errors.dateOfBirth}
                        </motion.p>
                    )}
                </div>

                <div className="space-y-2 group/input">
                    <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${touched.address && errors.address ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-600'}`}>
                        Residential Address
                    </label>
                    <div className="relative">
                        <div className={`absolute left-6 top-8 z-10 transition-colors duration-300 pointer-events-none ${touched.address && errors.address ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-500'}`}>
                            <FaMapMarkerAlt className="text-xl" />
                        </div>
                        <Field
                            name="address"
                            as="textarea"
                            className={`w-full pl-16 pr-8 py-6 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm min-h-[160px] bg-white/40 backdrop-blur-xl border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-orange-500/30
                ${touched.address && errors.address ? 'border-red-500/50 bg-red-500/5 text-red-500' : 'hover:border-neutral-300'}
                shadow-sm group-focus-within/input:shadow-2xl group-focus-within/input:shadow-orange-500/5`}
                            placeholder="Enter your full residential address"
                        />
                        <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none transition-all duration-300 opacity-0 group-focus-within/input:opacity-100 ring-[6px] ring-orange-500/5" />
                    </div>
                    {touched.address && errors.address && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-[10px] font-bold text-red-500 italic flex items-center gap-2 px-1 uppercase tracking-wider"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {errors.address}
                        </motion.p>
                    )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                    <Button
                        type="submit"
                        text={isSubmitting ? "Updating..." : "Save Changes"}
                        classes="w-full md:w-auto bg-neutral-900 text-white py-5 px-16 rounded-[2.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black transition-all"
                        disabled={isSubmitting}
                    />
                </motion.div>
            </Form>
        )}
    </Formik>
);

export default ProfileForm;




