import { onSnapshot, queryEqual } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

const useFirestoreQuery = (query: any) => {
  const [docs, setDocs] = useState([]);

  // Store current query in ref
  const queryRef = useRef(query);

  // Compare current query with the previous one
  useEffect(() => {
    // Use Firestore built-in 'isEqual' method
    // to compare queries
    if (!queryRef?.current && queryEqual(queryRef?.current, query)) {
      queryRef.current = query;
    }
  });

  // Re-run data listener only if query has changed
  useEffect(() => {
    if (!queryRef.current) {
      return null;
    }

    // Subscribe to query with onSnapshot
    const unsubscribe = onSnapshot(queryRef.current, (querySnapshot: any) => {
      // Get all documents from collection - with IDs
      const data = querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Update state
      setDocs(data);
    });

    // Detach listener
    return unsubscribe;
  }, [queryRef]);

  return docs;
};

export default useFirestoreQuery;
