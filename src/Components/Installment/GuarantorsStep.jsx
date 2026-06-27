import React from 'react';
import Input from '../Input';

const GuarantorsStep = ({ formik }) => {
  return (
    <div className="space-y-10">
      {/* Guarantor 1 */}
      <div className="space-y-6 bg-neutral-50/50 p-8 rounded-[2rem] border-2 border-neutral-100/50 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
         <div className="flex items-center gap-4 mb-2">
           <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">1</div>
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Guarantor 1</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input
             label="Full Name"
             variant="light"
             value={formik.values.g1Name}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             name="g1Name"
             error={formik.touched.g1Name && formik.errors.g1Name}
           />
           <Input
             label="Phone Number"
             type="tel"
             variant="light"
             value={formik.values.g1Phone}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             name="g1Phone"
             error={formik.touched.g1Phone && formik.errors.g1Phone}
           />
         </div>

         <Input
           label="Relationship"
           variant="light"
           value={formik.values.g1Relationship}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           name="g1Relationship"
           placeholder="e.g., Parent, Sibling, Employer"
           error={formik.touched.g1Relationship && formik.errors.g1Relationship}
         />

         <Input
           label="Residential Address"
           variant="light"
           value={formik.values.g1Address}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           name="g1Address"
           error={formik.touched.g1Address && formik.errors.g1Address}
         />

         <div className="pt-4 border-t border-neutral-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">Guarantor 1 Employment</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input
               label="Employer Name"
               variant="light"
               value={formik.values.g1Employer}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g1Employer"
               error={formik.touched.g1Employer && formik.errors.g1Employer}
             />
             <Input
               label="Job Title"
               variant="light"
               value={formik.values.g1Job}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g1Job"
               error={formik.touched.g1Job && formik.errors.g1Job}
             />
           </div>
           <div className="mt-6">
             <Input
               label="Monthly Income (₦)"
               type="number"
               variant="light"
               value={formik.values.g1Income}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g1Income"
               min="0"
               error={formik.touched.g1Income && formik.errors.g1Income}
             />
           </div>
         </div>
      </div>

      {/* Guarantor 2 */}
      <div className="space-y-6 bg-neutral-50/50 p-8 rounded-[2rem] border-2 border-neutral-100/50 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
         <div className="flex items-center gap-4 mb-2">
           <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-600 font-black">2</div>
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Guarantor 2</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input
             label="Full Name"
             variant="light"
             value={formik.values.g2Name}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             name="g2Name"
             error={formik.touched.g2Name && formik.errors.g2Name}
           />
           <Input
             label="Phone Number"
             type="tel"
             variant="light"
             value={formik.values.g2Phone}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             name="g2Phone"
             error={formik.touched.g2Phone && formik.errors.g2Phone}
           />
         </div>

         <Input
           label="Relationship"
           variant="light"
           value={formik.values.g2Relationship}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           name="g2Relationship"
           placeholder="e.g., Parent, Sibling, Employer"
           error={formik.touched.g2Relationship && formik.errors.g2Relationship}
         />

         <Input
           label="Residential Address"
           variant="light"
           value={formik.values.g2Address}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           name="g2Address"
           error={formik.touched.g2Address && formik.errors.g2Address}
         />

         <div className="pt-4 border-t border-neutral-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">Guarantor 2 Employment</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input
               label="Employer Name"
               variant="light"
               value={formik.values.g2Employer}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g2Employer"
               error={formik.touched.g2Employer && formik.errors.g2Employer}
             />
             <Input
               label="Job Title"
               variant="light"
               value={formik.values.g2Job}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g2Job"
               error={formik.touched.g2Job && formik.errors.g2Job}
             />
           </div>
           <div className="mt-6">
             <Input
               label="Monthly Income (₦)"
               type="number"
               variant="light"
               value={formik.values.g2Income}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               name="g2Income"
               min="0"
               error={formik.touched.g2Income && formik.errors.g2Income}
             />
           </div>
         </div>
      </div>
    </div>
  );
};

export default GuarantorsStep;
