import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "./ui/Breadcrumb";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";

export default function Tables({ tables, selectedTable, setSelectedTable }: { tables: string[]; selectedTable: string | null; setSelectedTable: (table: string) => void }) {
    return (
        <div className="h-max">
            <Card>
                <CardHeader>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>Database</BreadcrumbItem>
                            {selectedTable && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>{selectedTable}</BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        {tables.map((table) => (
                            <Button variant="ghost" className="justify-start" key={table} onClick={() => setSelectedTable(table)}>
                                {table.length > 15 ? `${table.substring(0, 15)}...` : table}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
