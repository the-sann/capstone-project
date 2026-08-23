import { Field, FieldLabel } from '@/components/ui/field';
import { router } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
interface Props {
    currentPage: number;
    lastPage: number;
}

export function PaginationIconsOnly({ currentPage, lastPage }: Props) {
    const goToPage = (page: number) => {
        router.get(
            '/dentists',
            { page },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
    return (
        <div className="flex items-center justify-start gap-4">
            <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">
                    Rows per page
                </FieldLabel>
                <Select defaultValue="25">
                    <SelectTrigger className="w-20" id="select-rows-per-page">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                        <SelectGroup>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={
                                currentPage === 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                            onClick={() => {
                                if (currentPage > 1) {
                                    goToPage(currentPage - 1);
                                }
                            }}
                        />
                        <PaginationNext
                            className={
                                currentPage === lastPage
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                            onClick={() => {
                                if (currentPage < lastPage) {
                                    goToPage(currentPage + 1);
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
