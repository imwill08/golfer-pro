
import React from 'react';
import { Button } from '@/components/ui/button';

interface InstructorPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InstructorPagination: React.FC<InstructorPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div className="join">
        <Button 
          variant="outline" 
          className="join-item"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button 
            key={page}
            variant={currentPage === page ? "default" : "outline"} 
            className="join-item"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          className="join-item"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </Button>
      </div>
    </div>
  );
};

export default InstructorPagination;
