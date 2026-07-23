import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import Input from '../Input';
import Button from '../Button';

const PasswordForm = ({ onSubmit }) => (
    <Formik
        initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }}
        validationSchema={Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('New password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm password is required')
        })}
        onSubmit={(values, actions) => onSubmit(values, actions)}
    >
        {({ isSubmitting, errors, touched, handleSubmit }) => (
            <Form className="space-y-6" onSubmit={handleSubmit}>
                <fieldset disabled={isSubmitting} className="border-0 p-0 m-0 min-w-0">
                <div className="space-y-1">
                    <Field
                        name="currentPassword"
                        type="password"
                        as={Input}
                        label="Current Password"
                        placeholder="••••••••"
                        variant="light"
                        icon={FaLock}
                        error={touched.currentPassword && errors.currentPassword}
                    />
                </div>

                <div className="space-y-1">
                    <Field
                        name="newPassword"
                        type="password"
                        as={Input}
                        label="New Password"
                        placeholder="••••••••"
                        variant="light"
                        icon={FaLock}
                        error={touched.newPassword && errors.newPassword}
                    />
                </div>

                <div className="space-y-1">
                    <Field
                        name="confirmPassword"
                        type="password"
                        as={Input}
                        label="Confirm New Password"
                        placeholder="••••••••"
                        variant="light"
                        icon={FaShieldAlt}
                        error={touched.confirmPassword && errors.confirmPassword}
                    />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                    <Button
                        type="submit"
                        text={isSubmitting ? "Changing..." : "Update Password"}
                        classes="w-full md:w-auto bg-neutral-900 text-white py-5 px-16 rounded-[2.5rem] font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black transition-all"
                        disabled={isSubmitting}
                    />
                </motion.div>
                </fieldset>
            </Form>
        )}
    </Formik>
);

export default PasswordForm;




