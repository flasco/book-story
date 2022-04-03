import ReactDOM from 'react-dom';
import { useUpdate } from '@/hooks/use-update';
import {
  JSXElementConstructor,
  memo,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
type Children = ReactElement<any, string | JSXElementConstructor<any>> | null;
interface Props {
  activeName?: string;
  isAsyncInclude: boolean; // 是否异步添加 Include  如果不是又填写了 true 会导致重复渲染
  include?: Array<string>;
  exclude?: Array<string>;
  maxLen?: number;
  children: Children;
}
function KeepAlive({ activeName, children, exclude, include, isAsyncInclude, maxLen = 10 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const components = useRef<Array<{ name: string; ele: Children }>>([]);
  const [asyncInclude] = useState<boolean>(isAsyncInclude);
  const update = useUpdate();

  useEffect(() => {
    if (activeName == null) {
      return;
    }
    // 缓存超过上限的
    if (components.current.length >= maxLen) {
      components.current = components.current.slice(1);
    }
    // 添加
    const component = components.current.find(res => res.name === activeName);
    if (component == null) {
      components.current = [
        ...components.current,
        {
          name: activeName,
          ele: children,
        },
      ];
      if (!asyncInclude) {
        update();
      }
    }
    return () => {
      if (exclude == null && include == null) {
        return;
      }
      components.current = components.current.filter(({ name }) => {
        if (exclude && exclude.includes(name)) {
          return false;
        }
        if (include) {
          return include.includes(name);
        }
        return true;
      });
    };
  }, [children, activeName, exclude, maxLen, include, update, asyncInclude]);
  return (
    <>
      <div ref={containerRef} className="keep-alive" />
      {components.current.map(({ name, ele }) => (
        <Component active={name === activeName} renderDiv={containerRef} name={name} key={name}>
          {ele}
        </Component>
      ))}
    </>
  );
}
export default memo(KeepAlive);

interface ComponentProps {
  active: boolean;
  children: Children;
  name: string;
  renderDiv: RefObject<HTMLDivElement>;
}

function Component({ active, children, name, renderDiv }: ComponentProps) {
  const [targetElement] = useState(() => document.createElement('div'));
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    if (active) {
      renderDiv.current?.appendChild(targetElement);
    } else {
      try {
        renderDiv.current?.removeChild(targetElement);
      } catch (e) {}
    }
  }, [active, name, renderDiv, targetElement]);
  useEffect(() => {
    targetElement.setAttribute('id', name);
  }, [name, targetElement]);
  return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>;
}

export const KeepAliveComponent = memo(Component);
