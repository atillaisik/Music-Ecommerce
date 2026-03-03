import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface AdminPlaceholderProps {
    title: string;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 10, scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6"
            >
                <Construction className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
                This section of the administrative panel is currently under development.
                It will feature advanced management tools for {title.toLowerCase()}.
            </p>
        </div>
    );
};

export default AdminPlaceholder;
