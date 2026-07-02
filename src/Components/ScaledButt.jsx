import * as motion from "motion/react-client"
import { MdOutlineRadioButtonChecked } from "react-icons/md";


export default function Gestures({text, icon}) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            style={{width: '350px'}}
            className="rounded-md bg-gradient-to-br from-yellow-100 to-stone-400 shadow-md px-4 py-5 text-stone-900 text-sm"
        >
            <MdOutlineRadioButtonChecked className="text-blue-600 text-xl mb-2" />
            {text}
            {icon}
        </motion.div>
    )
}

/**
 * ==============   Styles   ================
 */





