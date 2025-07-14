interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2 text-xs text-neutral-600">
              {item.current ? (
                <span className="cursor-text text-inherit">
                  {item.label}
                </span>
              ) : (
                <a 
                  href={item.href} 
                  className="text-blue-600 hover:text-blue-800 no-underline transition-colors"
                >
                  {item.label}
                </a>
              )}
              {index < items.length - 1 && (
                <span aria-hidden="true" className="text-neutral-400">/</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Breadcrumb;