import React, {PropsWithChildren} from "react";

export default function AdminLayout({children}:PropsWithChildren) {
    return (
        <div className="admin-body">
            {children}
        </div>
    );
}
