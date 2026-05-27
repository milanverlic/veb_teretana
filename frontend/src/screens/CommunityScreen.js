import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaUserCircle, FaDownload } from 'react-icons/fa';
import initialFeedData from '../feedData';

const CommunityScreen = () => {
  // Prilikom prvog učitavanja sortiramo niz po broju lajkova (opadajuće)
  const sortedData = [...initialFeedData].sort((a, b) => b.likes - a.likes);
  const [posts, setPosts] = useState(sortedData);

  // Funkcija za lajkovanje i automatsko presortiranje
  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const isLiked = post.userLiked;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          userLiked: !isLiked
        };
      }
      return post;
    });
    
    // Ponovo sortiramo da bi objava koja dobije lajk odmah otišla gore
    setPosts(updatedPosts.sort((a, b) => b.likes - a.likes));
  };

  return (
    <Container className="py-4">
      <h2 className="mb-1 fw-bold">Zajednica</h2>
      <p className="text-muted mb-4">Inspiracija od drugih korisnika. Najpopularniji treninzi su na vrhu!</p>
      
      {posts.map((post) => (
        <Card key={post._id} className="mb-4 shadow-sm border-0 bg-light">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div className="d-flex align-items-center">
                <FaUserCircle size={28} className="me-2 text-secondary" />
                <span className="fw-bold">{post.user}</span>
              </div>
              <small className="text-muted">{post.time}</small>
            </div>
            
            <Card.Title className="text-primary fw-bold">{post.workoutName}</Card.Title>
            <Card.Text className="text-light">{post.description}</Card.Text>
            
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button 
                variant={post.userLiked ? 'danger' : 'outline-danger'} 
                size="sm" 
                onClick={() => handleLike(post._id)}
                className="d-flex align-items-center px-3"
              >
                {post.userLiked ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
                {post.likes}
              </Button>
              <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                <FaDownload className="me-2" /> Sačuvaj šablon
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default CommunityScreen;