import React, { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import Pagination from './Pagination';

const CategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data: categoriesData, isLoading, error } = trpc.categories.getCategories.useQuery({ page, limit });
  const { data: userInterests, refetch: refetchUserInterests } = trpc.categories.getUserInterests.useQuery();
  const updateInterestsMutation = trpc.categories.updateUserInterests.useMutation({
    onSuccess: () => refetchUserInterests(),
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (userInterests) {
      setSelectedInterests(userInterests.map(interest => interest.categoryId));
    }
  }, [userInterests]);

  const handleInterestToggle = (categoryId: string) => {
    const updatedInterests = selectedInterests.includes(categoryId)
      ? selectedInterests.filter(id => id !== categoryId)
      : [...selectedInterests, categoryId];

    setSelectedInterests(updatedInterests);
    updateInterestsMutation.mutate({ categoryIds: updatedInterests });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!categoriesData || categoriesData.categories.length === 0) return <div>No categories found</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Please mark your interests!</h2>
      <p className="mb-4">We will keep you notified.</p>
      <h3 className="text-xl font-semibold mb-2">My saved interests!</h3>
      <div className="space-y-2 mb-4">
        {categoriesData.categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              type="checkbox"
              id={category.id}
              checked={selectedInterests.includes(category.id)}
              onChange={() => handleInterestToggle(category.id)}
              className="mr-2 h-5 w-5"
            />
            <label htmlFor={category.id} className="text-lg cursor-pointer">{category.name}</label>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={categoriesData.currentPage}
        totalPages={categoriesData.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CategoryList;